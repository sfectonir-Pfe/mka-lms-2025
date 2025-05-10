import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap"; // Removed Button
// Removed useNavigate

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const module = JSON.parse(localStorage.getItem("module")) || [];
    const allCourses = module.flatMap((mod) =>
      mod.courses.map((course) => ({
        ...course,
        moduleTitle: mod.title,
      }))
    );
    setCourses(allCourses);
  }, []);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>📚 Tous les cours</h3>
      </div>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {courses.length === 0 ? (
          <p>Aucun cours trouvé.</p>
        ) : (
          courses.map((course) => (
            <Col key={course.id}>
              <Card>
                {course.type.startsWith("image") && (
                  <Card.Img variant="top" src={course.previewUrl} alt={course.name} />
                )}
                {course.type.startsWith("video") && (
                  <video controls width="100%">
                    <source src={course.previewUrl} type={course.type} />
                  </video>
                )}
                {course.type === "application/pdf" && (
                  <div className="p-3">
                    <a href={course.previewUrl} target="_blank" rel="noopener noreferrer">
                      📄 Voir le fichier PDF
                    </a>
                  </div>
                )}
                <Card.Body>
                  <Card.Title>{course.name}</Card.Title>
                  <Card.Text>
                    Module : <strong>{course.moduleTitle}</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default AllCoursesPage;
