import { useState, useEffect } from "react";
import Sidebar from "../../components/admin_sidepanel";

const AdminAnnouncements = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  const [editId, setEditId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch announcements
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/getannouncement`)
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err));
  }, []);

  // Add Announcement
  const handleAddAnnouncement = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/addannouncement`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload announcement");

      const newAnnouncement = await res.json();
      setAnnouncements([newAnnouncement, ...announcements]);
      resetForm();
      showToast("✅ Announcement created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading announcement");
    } finally {
      setShowCreateModal(false);
    }
  };

  // Edit Announcement
  const handleEditAnnouncement = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/editannouncement/${editId}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update announcement");

      const updated = await res.json();
      setAnnouncements(announcements.map((a) => (a.id === editId ? updated : a)));
      resetForm();
      showToast("✏️ Announcement updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error editing announcement");
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/deleteannouncement/${id}`, {
        method: "DELETE",
      });
      setAnnouncements(announcements.filter((a) => a.id !== id));
      showToast("🗑️ Announcement deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting announcement");
    }
  };

  // Utility functions
  const resetForm = () => {
    setCaption("");
    setImage(null);
    setEditId(null);
  };

  const showToast = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Announcements</h2>
          <div>
            <button className="btn btn-success me-2" onClick={() => setShowCreateModal(true)}>
              + Add New
            </button>
            <button className="btn btn-primary" onClick={() => setShowManageModal(true)}>
              Manage Announcements
            </button>
          </div>
        </div>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {/* Display announcements grid */}
        <div className="row">
          {announcements.length > 0 ? (
            announcements.map((a) => (
              <div key={a.id} className="col-md-4 mb-3">
                <div className="card shadow-sm h-100">
                  <img
                    src={a.image_url}
                    className="card-img-top"
                    alt={a.caption}
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <p className="card-text">{a.caption}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No announcements available.</p>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <Modal
            title="Create Announcement"
            onClose={() => {
              resetForm();
              setShowCreateModal(false);
            }}
            onConfirm={handleAddAnnouncement}
          >
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Enter caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Modal>
        )}

        {/* Manage Modal */}
        {showManageModal && (
          <Modal
            title="Manage Announcements"
            onClose={() => {
              resetForm();
              setShowManageModal(false);
            }}
          >
            {announcements.length > 0 ? (
              announcements.map((a) => (
                <div key={a.id} className="d-flex align-items-center mb-3">
                  <img
                    src={a.image_url}
                    alt={a.caption}
                    style={{ width: "60px", height: "60px", objectFit: "cover", marginRight: "10px" }}
                  />
                  <span className="flex-grow-1">{a.caption}</span>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditId(a.id);
                      setCaption(a.caption);
                      setImage(null);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteAnnouncement(a.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted">No announcements to manage.</p>
            )}
          </Modal>
        )}
      </div>
    </div>
  );
};

// Simple reusable Modal
const Modal = ({ title, children, onClose, onConfirm }) => (
  <>
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            {onConfirm && (
              <button className="btn btn-success" onClick={onConfirm}>
                Save
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop fade show"></div>
  </>
);

export default AdminAnnouncements;
