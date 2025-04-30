import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, Spinner } from "react-bootstrap";

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual NestJS API endpoint
    axios.get("http://localhost:3000/programs")
      .then((response) => {
        setPrograms(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching programs:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Our Programs</h1>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {programs.map((program) => (
            <Col key={program.id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{program.title}</Card.Title>
                  <Card.Text>{program.description}</Card.Text>
                  <Card.Text>
                    <strong>Duration:</strong> {program.duration}
                  </Card.Text>
                  <Button variant="primary">Enroll</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ProgramsPage;
