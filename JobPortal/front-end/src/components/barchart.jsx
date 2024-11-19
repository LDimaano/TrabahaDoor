import React, { useEffect, useState } from "react";
import { Tooltip, OverlayTrigger, Tabs, Tab, Alert, Card, Container, Row, Col, Button } from "react-bootstrap";
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

  // Convert the data into an array of industries and their corresponding heights
  const industries = Object.keys(timeToFillData)
    .map((industry) => ({
      name: industry,
      height: timeToFillData[industry] || 0,
    }))
    // Sort the industries based on the height in descending order
    .sort((a, b) => b.height - a.height);

  // Determine maximum height for scaling
  const maxBarHeight = 200; // Maximum height in pixels for the tallest bar
  const maxHeightValue = Math.max(...industries.map((industry) => industry.height));

  // Scale bar heights proportionally
  industries.forEach((industry) => {
    industry.scaledHeight = (industry.height / maxHeightValue) * maxBarHeight;
  });

  // Function to export the data as CSV
  const exportToCSV = () => {
    const csvData = industries.map(({ name, height }) => `${name},${height}`).join("\n");
    const blob = new Blob([`Industry,Time to Fill (days)\n${csvData}`], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "time_to_fill_report.csv");
  };

  // Function to export the data as PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Time to Fill Analysis Report", 14, 20);
    doc.setFontSize(12);
    doc.text("Industry-wise Time to Fill Data", 14, 30);

    // Add table header
    doc.text("Industry", 14, 40);
    doc.text("Time to Fill (days)", 90, 40);

    // Add industry data to the PDF
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
          <h4 className="text-dark">Time to Fill Analysis</h4>
          <p className="text-muted">Showing Average Time to Fill per Industry</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Tabs defaultActiveKey="timeToFill" id="timeToFill-tabs" className="mb-4">
            <Tab eventKey="timeToFill" title="Time to Fill">
              <Row className="justify-content-center">
                {industries.map((industry, index) => (
                  <Col key={index} className="text-center" xs={2}>
                    <div className="d-flex flex-column align-items-center">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>{`${industry.height} days`}</Tooltip>}
                      >
                        <div
                          className="bar"
                          style={{
                            height: `${industry.scaledHeight}px`,
                            width: "40px",
                            backgroundColor: "blue",
                            marginBottom: "10px",
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
                      <span
                        className="text-muted"
                        style={{
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "80px",
                        }}
                      >
                        {industry.name}
                      </span>
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="mt-4 d-flex align-items-center">
                <div
                  className="bg-primary"
                  style={{ width: "16px", height: "16px", borderRadius: "3px", marginRight: "8px" }}
                ></div>
                <span className="text-muted">Days</span>
              </div>

              {/* Report Generation Buttons */}
              <div className="mt-4 d-flex justify-content-end">
                <Button variant="outline-primary" className="me-2" onClick={exportToCSV}>
                  Download CSV
                </Button>
                <Button variant="outline-secondary" onClick={exportToPDF}>
                  Download PDF
                </Button>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BarChart;
