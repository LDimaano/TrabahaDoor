import { useState, useEffect } from "react";

const AdminAnnouncements = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  // Fetch announcements
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/getannouncement`)
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err));
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption || !image) {
      alert("Please provide both caption and image");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/addannouncement`, {
      method: "POST",
      body: formData,
    });

    const newAnnouncement = await res.json();
    setAnnouncements([newAnnouncement, ...announcements]); // prepend
    setCaption("");
    setImage(null);
  };

  // Delete announcement
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    await fetch(`${process.env.REACT_APP_API_URL}/api/deleteannouncement/${id}`, {
      method: "DELETE",
    });

    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Manage Announcements</h2>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Upload Announcement
        </button>
      </form>

      {/* Announcements List */}
      <div className="row">
        {announcements.map((a) => (
          <div key={a.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <img
                src={a.image_url}
                className="card-img-top"
                alt={a.caption}
                style={{ maxHeight: "200px", objectFit: "cover" }}
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
