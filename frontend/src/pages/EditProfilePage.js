import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Avatar, Typography } from '@mui/material';

function EditProfilePage() {
  const [name, setName] = useState('Yasmeen');
  const [email, setEmail] = useState('yasmeen@example.com');
  const [bio, setBio] = useState('I am passionate about web development.');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file)); // Create object URL for image preview
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you can add logic to save or upload the profile information
    alert('Profile Updated!');
  };

  return (
    <div className="EditProfile">
      <Container className="mt-5">
        <Row>
          <Col md={4} className="text-center">
            <Avatar
              alt="Profile Picture"
              src={profilePicture || 'https://via.placeholder.com/150'}
              sx={{ width: 150, height: 150 }}
              className="mb-3"
            />
            <Button variant="outlined" component="label">
              Upload Profile Picture
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleProfilePictureChange} // Properly handle file selection
              />
            </Button>
          </Col>

          <Col md={8}>
            <Card className="shadow-lg">
              <Card.Body>
                <Card.Title>Edit Profile</Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Enter your name"
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                    />
                  </Form.Group>

                  <Form.Group controlId="formBio" className="mt-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={bio}
                      onChange={handleBioChange}
                      placeholder="Tell us something about yourself"
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="mt-3">
                    Save Changes
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EditProfilePage;
