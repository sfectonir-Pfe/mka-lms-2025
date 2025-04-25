import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const ProfilePage = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <Row>
                <Col md={4} className="text-center">
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                    className="img-fluid rounded-circle mb-3"
                  />
                </Col>
                <Col md={8}>
                  <h3>Jane Doe</h3>
                  <p className="text-muted">Frontend Developer</p>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <Button variant="primary">Edit Profile</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Header>Contact Info</Card.Header>
            <Card.Body>
              <p><strong>Email:</strong> jane.doe@example.com</p>
              <p><strong>Phone:</strong> (123) 456-7890</p>
              <p><strong>Location:</strong> New York, USA</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
