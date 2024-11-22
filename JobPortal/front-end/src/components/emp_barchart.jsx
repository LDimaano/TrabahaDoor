const maxHeight = Math.max(...jobTitles.map((job_title) => job_title.height), 1); // Prevent divide-by-zero
const maxBarHeight = 200; // Max bar height in pixels
const barSpacing = 10; // Fixed spacing between bars

return (
  <section className="card border-light shadow-sm p-4">
    <header className="mb-4 d-flex justify-content-between align-items-center">
      <div>
        <h2 className="h4 text-dark">Time to Fill Analysis</h2>
        <p className="text-muted">Showing Average Time to Fill per Job Title</p>
      </div>
      <Button variant="primary" onClick={generatePDFReport}>
        <FontAwesomeIcon icon={faDownload} className="me-2" />
        Export Data
      </Button>
    </header>

    {error && <div className="alert alert-danger">{error}</div>}

    <nav className="nav nav-tabs mb-4">
      <button className="nav-link active" aria-current="page">
        Time to Fill
      </button>
    </nav>

    {/* Bar chart container */}
    <div
      className="d-flex justify-content-between align-items-end"
      style={{
        height: `${maxBarHeight + 50}px`,
        width: '100%',
        overflow: 'hidden',
        marginBottom: '20px',
      }}
    >
      {jobTitles.map((job_title, index) => {
        const barHeight = (job_title.height / maxHeight) * maxBarHeight;

        return (
          <div
            key={index}
            className="text-center"
            style={{
              marginRight: index < jobTitles.length - 1 ? `${barSpacing}px` : '0',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{`${job_title.height} days`}</Tooltip>}
            >
              <div
                className="position-relative"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: 'blue',
                  border: '2px solid rgba(0, 0, 123, 0.5)',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '100%', // Use full width of the parent
                }}
              ></div>
            </OverlayTrigger>
          </div>
        );
      })}
    </div>

    {/* X-axis labels */}
    <div className="d-flex justify-content-between" style={{ width: '100%' }}>
      {jobTitles.map((job_title, index) => (
        <div key={index} className="text-center" style={{ flex: 1 }}>
          <span className="text-muted">{job_title.name}</span>
        </div>
      ))}
    </div>

    <div className="mt-4">
      <div className="d-flex align-items-center">
        <div
          className="bg-primary"
          style={{ width: '16px', height: '16px', borderRadius: '3px', marginRight: '8px' }}
        ></div>
        <span className="text-muted">Days</span>
      </div>
    </div>
  </section>
);
