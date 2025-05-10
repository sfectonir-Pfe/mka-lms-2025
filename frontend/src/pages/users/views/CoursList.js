import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

const CoursList = ({ courses }) => {
  return (
    <Row>
      {courses.map((course) => (
        <Col md={4} className="mb-4" key={course.id}>
          <Card>
            <Card.Img
              variant="top"
              src={
                course.type === "IMAGE"
                  ? course.fileUrl
                  : course.type === "PDF"
                  ? "/assets/pdf-icon.png"
                  : course.type === "VIDEO"
                  ? "/assets/video-icon.png"
                  : "/assets/file-icon.png"
              }
              style={{ height: "200px", objectFit: "cover" }}
              onError={(e) => (e.target.src = "/assets/image-error.png")}
            />
            <Card.Body className="text-center">
              <Card.Title>{course.title}</Card.Title>
              <p className="text-muted small mb-2">Type : {course.type}</p>
              <Button
                variant="primary"
                onClick={() => window.open(course.fileUrl, "_blank")}
              >
                Voir le fichier
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CoursList;
