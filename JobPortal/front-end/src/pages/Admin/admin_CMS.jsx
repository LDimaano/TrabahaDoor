import { useState, useEffect } from "react";

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  // Fetch announcements
  useEffect(() => {
    fetch("http://localhost:5000/announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err));
  }, []);

  // Add new announcement
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!imageUrl || !caption) return alert("Please fill in all fields");

    try {
      const res = await fetch("http://localhost:5000/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl, caption }),
      });

      const newAnnouncement = await res.json();
      setAnnouncements([newAnnouncement, ...announcements]);
      setImageUrl("");
      setCaption("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete announcement
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await fetch(`http://localhost:5000/announcements/${id}`, {
        method: "DELETE",
      });
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Manage Announcements</h2>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Caption</label>
          <input
            type="text"
            className="form-control"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter caption"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Announcement
        </button>
      </form>

      {/* List Announcements */}
      <div className="row">
        {announcements.map((a) => (
          <div key={a.id} className="col-md-4 mb-3">
            <div className="card">
              <img
                src={a.image_url}
                alt={a.caption}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <p className="card-text">{a.caption}</p>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(a.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
