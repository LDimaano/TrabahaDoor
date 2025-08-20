import { useState, useEffect } from "react";

const AdminAnnouncements = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/getannouncement`)
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err));
  }, []);

  // Upload announcement
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption || !image) {
      alert("Please provide both caption and image");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/addannouncement`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload announcement");

      const newAnnouncement = await res.json();
      setAnnouncements([newAnnouncement, ...announcements]);

      // Reset inputs
      setCaption("");
      setImage(null);

      // Show success message
      setSuccessMessage("✅ Announcement uploaded successfully!");

      // Hide success message after 3s
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error uploading announcement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/deleteannouncement/${id}`, {
        method: "DELETE",
      });

      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting announcement");
    }
  };

  return (
    <div>
      {/* Button to open modal */}
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        Manage Announcements
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">Manage Announcements</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                {/* Success Message */}
                {successMessage && (
                  <div className="alert alert-success py-2">{successMessage}</div>
                )}

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
                  <div className="mb-3 d-flex">
                    <input
                      type="file"
                      className="form-control me-2"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                    <button type="submit" className="btn btn-success">
                      Upload
                    </button>
                  </div>
                </form>

                {/* Announcements List (all shown here) */}
                <div className="row">
                  {announcements.length > 0 ? (
                    announcements.map((a) => (
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
                    ))
                  ) : (
                    <p className="text-muted">No announcements yet.</p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background overlay */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default AdminAnnouncements;
