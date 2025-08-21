import { useState, useEffect } from "react";
import Sidebar from "../../components/admin_sidepanel";

const AdminAnnouncements = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [showAddConfirm, setShowAddConfirm] = useState(false);

  // States for Editing
  const [editId, setEditId] = useState(null);
  const [showEditConfirm, setShowEditConfirm] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/getannouncement`)
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err));
  }, []);

  // Add Announcement
  const handleAddConfirm = async () => {
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
      setSuccessMessage("✅ Announcement uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error uploading announcement");
    } finally {
      setShowAddConfirm(false);
    }
  };

  // Edit Announcement
  const handleEditConfirm = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/editannouncement/${editId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to edit announcement");

      const updatedAnnouncement = await res.json();
      setAnnouncements(
        announcements.map((a) => (a.id === editId ? updatedAnnouncement : a))
      );

      resetForm();
      setSuccessMessage("✏️ Announcement updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error editing announcement");
    } finally {
      setShowEditConfirm(false);
    }
  };

  // Delete Announcement
  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/deleteannouncement/${deleteId}`, {
        method: "DELETE",
      });
      setAnnouncements(announcements.filter((a) => a.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting announcement");
    }
  };

  // Reset form state
  const resetForm = () => {
    setCaption("");
    setImage(null);
    setEditId(null);
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Announcements</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Manage Announcements
          </button>
        </div>

        {/* Display Announcements */}
        <div className="row">
          {announcements.length > 0 ? (
            announcements.map((a) => (
              <div key={a.id} className="col-md-4 mb-3">
                <div className="card h-100 shadow-sm">
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

        {/* === Modal for Manage Announcements === */}
        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Manage Announcements</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  {successMessage && (
                    <div className="alert alert-success py-2">{successMessage}</div>
                  )}

                  {/* Upload or Edit form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!caption) {
                        alert("Caption is required");
                        return;
                      }
                      editId ? setShowEditConfirm(true) : setShowAddConfirm(true);
                    }}
                    className="mb-4"
                  >
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
                        {editId ? "Update" : "Upload"}
                      </button>
                    </div>
                  </form>

                  {/* Announcement list inside modal */}
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
                                onClick={() => setDeleteId(a.id)}
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

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showModal && <div className="modal-backdrop fade show"></div>}

        {/* Add Confirmation Modal */}
        {showAddConfirm && (
          <ConfirmModal
            title="Confirm Add"
            message="Do you want to add this announcement?"
            onCancel={() => setShowAddConfirm(false)}
            onConfirm={handleAddConfirm}
          />
        )}

        {/* Edit Confirmation Modal */}
        {showEditConfirm && (
          <ConfirmModal
            title="Confirm Edit"
            message="Do you want to save the changes to this announcement?"
            onCancel={() => setShowEditConfirm(false)}
            onConfirm={handleEditConfirm}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <ConfirmModal
            title="Confirm Delete"
            message="Do you want to delete this announcement?"
            onCancel={() => setDeleteId(null)}
            onConfirm={handleDeleteConfirm}
            danger
          />
        )}
      </div>
    </div>
  );
};

// Reusable confirmation modal component
const ConfirmModal = ({ title, message, onCancel, onConfirm, danger }) => (
  <>
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className={`modal-title ${danger ? "text-danger" : ""}`}>{title}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button className={`btn ${danger ? "btn-danger" : "btn-success"}`} onClick={onConfirm}>
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop fade show"></div>
  </>
);

export default AdminAnnouncements;
