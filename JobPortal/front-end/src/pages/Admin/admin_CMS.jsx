import { useState, useEffect } from "react";
import Sidebar from "../../components/admin_sidepanel";

const AdminAnnouncements = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

  // Fetch all announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements/getannouncement");
      const data = await res.json();
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Add new announcement
  const handleAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/announcements/addannouncement", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSuccessMessage("Announcement added successfully!");
        fetchAnnouncements();
        setShowCreateModal(false);
        setCaption("");
        setImage(null);
      }
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  // Open edit modal
  const handleEditClick = (announcement) => {
    setCurrentAnnouncement(announcement);
    setCaption(announcement.caption);
    setImage(null);
    setShowEditModal(true);
  };

  // Update announcement
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(
        `/api/announcements/updateannouncement/${currentAnnouncement.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (res.ok) {
        setSuccessMessage("Announcement updated successfully!");
        fetchAnnouncements();
        setShowEditModal(false);
        setCaption("");
        setImage(null);
      }
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (announcement) => {
    setCurrentAnnouncement(announcement);
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `/api/announcements/deleteannouncement/${currentAnnouncement.id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setSuccessMessage("Announcement deleted successfully!");
        fetchAnnouncements();
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Admin Announcements</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Add Announcement
          </button>
        </div>

        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <div className="row">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="col-md-4 mb-3">
              <div className="card shadow-sm">
                <img
                  src={announcement.image_url}
                  className="card-img-top"
                  alt="Announcement"
                />
                <div className="card-body">
                  <p>{announcement.caption}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEditClick(announcement)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(announcement)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content p-3">
                <h5>Add Announcement</h5>
                <form onSubmit={handleAdd}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    required
                  />
                  <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content p-3">
                <h5>Edit Announcement</h5>
                <form onSubmit={handleUpdate}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    required
                  />
                  <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-warning">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content p-3">
                <h5>Confirm Delete</h5>
                <p>
                  Are you sure you want to delete "
                  <strong>{currentAnnouncement?.caption}</strong>"?
                </p>
                <div className="text-end">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
