import React, { useEffect, useState } from 'react';
import { Tooltip, OverlayTrigger, Tabs, Tab, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  // Convert the data into an array of industries and their corresponding heights
  const industries = Object.keys(timeToFillData)
    .map((industry) => ({
      name: industry,
      height: timeToFillData[industry] || 0,
    }))
    // Sort the industries based on the height in descending order
    .sort((a, b) => b.height - a.height);

  return (
    <Container>
      <Card className="shadow-sm p-4">
        <Card.Body>
          <h4 className="text-dark">Time to Fill Analysis</h4>
          <p className="text-muted">Showing Average Time to Fill per Industry</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Tabs defaultActiveKey="timeToFill" id="timeToFill-tabs" className="mb-4">
            <Tab eventKey="timeToFill" title="Time to Fill">
              <Row className="d-flex justify-content-between">
                {industries.map((industry, index) => (
                  <Col key={index} className="text-center" xs={2}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{`${industry.height} days`}</Tooltip>}
                    >
                      <div
                        className="position-relative"
                        style={{
                          height: `${industry.height}px`,
                          width: '48px',
                          cursor: 'pointer',
                          backgroundColor: 'blue',
                          borderRadius: '5px',
                          transition: 'background-color 0.3s ease, transform 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.8)';
                          e.currentTarget.style.transform = 'scale(1.1)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                          e.currentTarget.style.zIndex = '1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'blue';
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.zIndex = '0';
                        }}
                      ></div>
                    </OverlayTrigger>
                    <span className="text-muted d-block mt-2">{industry.name}</span>
                  </Col>
                ))}
              </Row>

              <div className="mt-4 d-flex align-items-center">
                <div className="bg-primary" style={{ width: '16px', height: '16px', borderRadius: '3px', marginRight: '8px' }}></div>
                <span className="text-muted">Days</span>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BarChart;
