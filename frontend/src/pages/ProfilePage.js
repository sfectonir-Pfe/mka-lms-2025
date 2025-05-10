import React from 'react';
import { Container, Row, Col, Card, Button, Image } from 'react-bootstrap';
import { Avatar, Typography } from '@mui/material';

function ProfilePage() {
  return (
    <div className="App">
      <Container className="mt-5">
        <Row>
          <Col md={4} className="text-center">
            <Avatar
              alt="User Profile"
              src="https://via.placeholder.com/150"
              sx={{ width: 150, height: 150 }}
              className="mb-3"
            />
            <Typography variant="h5">Yasmeen</Typography>
            <Typography variant="body2" color="textSecondary">
              Frontend Developer
            </Typography>
          </Col>

          <Col md={8}>
            <Card className="shadow-lg">
              <Card.Body>
                <Card.Title>About Me</Card.Title>
                <Card.Text>
                  Hello, I'm Yasmeen! I'm passionate about web development, coding, and learning new technologies. I specialize in React, JavaScript, and web design.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Contact Info</Card.Title>
                <ul>
                  <li>Email: yasmeen@example.com</li>
                  <li>Location: New York, USA</li>
                  <li>Phone: +1 234 567 890</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Skills</Card.Title>
                <ul>
                  <li>ReactJS</li>
                  <li>JavaScript</li>
                  <li>HTML/CSS</li>
                  <li>Bootstrap</li>
                  <li>Material UI</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProfilePage;
