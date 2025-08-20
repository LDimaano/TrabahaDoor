import { useState, useEffect } from "react";
import Sidebar from "../../components/admin_sidepanel";

const AdminAnnouncements = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [deleteId, setDeleteId] = useState(null); // For delete confirmation
  const [showAddConfirm, setShowAddConfirm] = useState(false); // For add confirmation

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/admin/getannouncement`)
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error(err));
  }, []);

  // Final Add announcement
  const handleAddConfirm = async () => {
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
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Error uploading announcement");
    } finally {
      setShowAddConfirm(false); // Close add confirmation modal
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/deleteannouncement/${deleteId}`, {
        method: "DELETE",
      });
      setAnnouncements(announcements.filter((a) => a.id !== deleteId));
      setDeleteId(null); // Close modal after delete
    } catch (err) {
      console.error(err);
      alert("Error deleting announcement");
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="container-fluid p-4">
        {/* Button to open modal */}
        <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
          Manage Announcements
        </button>

        {/* Main Modal for Manage Announcements */}
        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title">Manage Announcements</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  {successMessage && (
                    <div className="alert alert-success py-2">{successMessage}</div>
                  )}

                  {/* Upload form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!caption || !image) {
                        alert("Please provide both caption and image");
                        return;
                      }
                      setShowAddConfirm(true); // show confirmation first
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
                        Upload
                      </button>
                    </div>
                  </form>

                  {/* Announcement list */}
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
                                onClick={() => setDeleteId(a.id)} // open delete modal
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

                {/* Footer */}
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
        {showModal && <div className="modal-backdrop fade show"></div>}

        {/* Add Confirmation Modal */}
        {showAddConfirm && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Add</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddConfirm(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Do you want to add this announcement?</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-success" onClick={handleAddConfirm}>
                    Yes, Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showAddConfirm && <div className="modal-backdrop fade show"></div>}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-danger">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setDeleteId(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Do you want to delete this announcement?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={handleDeleteConfirm}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {deleteId && <div className="modal-backdrop fade show"></div>}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
