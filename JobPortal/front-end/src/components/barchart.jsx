import React, { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger, Alert, Card, Container, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

function BarChart() {
  const [timeToFillData, setTimeToFillData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/timetofill`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setTimeToFillData(data))
      .catch((error) => {
        console.error("Error fetching time to fill data:", error);
        setError(error.message);
      });
  }, []);

  const industries = Object.keys(timeToFillData)
    .map((industry) => ({
      name: industry,
      height: timeToFillData[industry] || 0,
    }))
    .sort((a, b) => b.height - a.height);

  const maxBarHeight = 200; 
  const maxHeightValue = Math.max(...industries.map((industry) => industry.height));

  industries.forEach((industry) => {
    industry.scaledHeight = (industry.height / maxHeightValue) * maxBarHeight;
  });

  const exportToCSV = () => {
    const csvData = industries.map(({ name, height }) => `${name},${height}`).join("\n");
    const blob = new Blob([`Industry,Time to Fill (days)\n${csvData}`], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "time_to_fill_report.csv");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Time to Fill Analysis Report", 14, 20);
    doc.setFontSize(12);
    doc.text("Industry-wise Time to Fill Data", 14, 30);

    doc.text("Industry", 14, 40);
    doc.text("Time to Fill (days)", 90, 40);

    industries.forEach((industry, index) => {
      doc.text(industry.name, 14, 50 + index * 10);
      doc.text(`${industry.height}`, 90, 50 + index * 10);
    });

    doc.save("time_to_fill_report.pdf");
  };

  return (
    <Container>
      <Card className="shadow-sm p-4">
        <Card.Body>
          <h4 className="text-dark text-left mb-4">Time to Fill Analysis</h4>
          <p className="text-muted text-left mb-5">Showing Average Time to Fill per Industry</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="d-flex flex-column align-items-center">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                height: `${maxBarHeight + 50}px`,
                paddingBottom: "50px",
                justifyContent: "space-around",
                width: "100%",
                maxWidth: "600px",
                marginTop: "20px",
              }}
            >
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className="d-flex flex-column align-items-center"
                  style={{ width: "70px" }}
                >
                  {/* Display value above the bar */}
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "darkslategray",
                      marginBottom: "5px",
                    }}
                  >
                    {`${industry.height} days`}
                  </span>

                  {/* Tooltip for hover functionality */}
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>{`${industry.height} days`}</Tooltip>}
                  >
                    <div
                      className="bar"
                      style={{
                        height: `${industry.scaledHeight}px`,
                        width: "100%",
                        backgroundColor: "blue",
                        borderRadius: "5px",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    ></div>
                  </OverlayTrigger>

                  {/* Display industry name below the bar */}
                  <div
                    className="text-center mt-2"
                    style={{
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "70px",
                    }}
                    title={industry.name}
                  >
                    {industry.name.length > 8
                      ? `${industry.name.substring(0, 7)}...`
                      : industry.name}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 d-flex align-items-center justify-content-start">
              <div
                className="bg-primary"
                style={{ width: "16px", height: "16px", borderRadius: "3px", marginRight: "8px" }}
              ></div>
              <span className="text-muted">Days</span>
            </div>

            <div className="mt-4 d-flex justify-content-start">
              <Button variant="outline-primary" className="me-2" onClick={exportToCSV}>
                Download CSV
              </Button>
              <Button variant="outline-secondary" onClick={exportToPDF}>
                Download PDF
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BarChart;
