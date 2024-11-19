import React, { useEffect, useState } from 'react';
import { Tooltip, OverlayTrigger, Tabs, Tab, Alert, Card, Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

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
        console.error('Error fetching time to fill data:', error);
        setError(error.message);
      });
  }, []);

  const industries = Object.keys(timeToFillData)
    .map((industry) => ({
      name: industry,
      height: timeToFillData[industry] || 0,
    }))
    .sort((a, b) => b.height - a.height);

  const exportToCSV = () => {
    const csvData = industries
      .map(({ name, height }) => `${name},${height}`)
      .join('\n');
    const blob = new Blob(
      [`Industry,Time to Fill (days)\n${csvData}`],
      { type: 'text/csv;charset=utf-8;' }
    );
    saveAs(blob, 'time_to_fill_report.csv');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Time to Fill Analysis Report', 14, 20);
    doc.setFontSize(12);
    doc.text('Industry-wise Time to Fill Data', 14, 30);

    doc.text('Industry', 14, 40);
    doc.text('Time to Fill (days)', 90, 40);

    industries.forEach((industry, index) => {
      doc.text(industry.name, 14, 50 + index * 10);
      doc.text(`${industry.height}`, 90, 50 + index * 10);
    });

    doc.save('time_to_fill_report.pdf');
  };

  return (
    <Container>
      <Card className="shadow-sm p-4">
        <Card.Body>
          <h4 className="text-dark">Time to Fill Analysis</h4>
          <p className="text-muted">Showing Average Time to Fill per Industry</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Tabs
            defaultActiveKey="timeToFill"
            id="timeToFill-tabs"
            className="mb-4"
          >
            <Tab eventKey="timeToFill" title="Time to Fill">
              <div style={{ position: 'relative', padding: '20px 0' }}>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '50px',
                    left: '0',
                    right: '0',
                    height: '1px',
                    backgroundColor: '#ccc',
                  }}
                ></div>
                <Row className="justify-content-center">
                  {industries.map((industry, index) => (
                    <Col
                      key={index}
                      className="text-center"
                      style={{ width: '80px' }}
                    >
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>{`${industry.height} days`}</Tooltip>
                        }
                      >
                        <div
                          style={{
                            height: `${industry.height * 5}px`, 
                            width: '48px',
                            margin: '0 auto',
                            backgroundColor: 'blue',
                            borderRadius: '5px',
                            transition: 'transform 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        ></div>
                      </OverlayTrigger>
                    </Col>
                  ))}
                </Row>
                <div
                  className="d-flex justify-content-center mt-2"
                  style={{ gap: '30px', marginTop: '10px' }}
                >
                  {industries.map((industry, index) => (
                    <span
                      key={index}
                      className="text-muted"
                      style={{
                        fontSize: '0.85rem',
                        textAlign: 'center',
                      }}
                    >
                      {industry.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 d-flex align-items-center">
                <div
                  className="bg-primary"
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '3px',
                    marginRight: '8px',
                  }}
                ></div>
                <span className="text-muted">Days</span>
              </div>
              <div className="mt-4 d-flex justify-content-end">
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={exportToCSV}
                >
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
