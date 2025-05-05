import React, { useMemo } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const skills = [
  {
    name: "Web Development",
    description:
      "Build responsive websites using HTML, CSS, JavaScript, and frameworks like React.",
    image: "/images/graphic-design.jpg",
    tutorial:
      "Start by learning HTML and CSS. Then move to JavaScript. Practice building responsive layouts using Flexbox and Grid. Finally, explore React for interactive UIs.",
  },
  {
    name: "Graphic Design",
    description:
      "Create stunning visuals using Photoshop, Illustrator, and Figma.",
    image: "/images/graphic-design.jpg",
    tutorial:
      "Master tools like Photoshop for image editing, Illustrator for vector design, and Figma for UI design. Practice with logo and banner design projects.",
  },
  {
    name: "Digital Marketing",
    description:
      "Master SEO, social media marketing, and analytics to grow your presence.",
    image: "/images/graphic-design.jpg",
    tutorial:
      "Understand SEO basics, run campaigns on Google Ads, learn social media algorithms, and explore analytics tools like Google Analytics.",
  },
  {
    name: "Photography",
    description:
      "Learn lighting, composition, and editing for capturing amazing shots.",
    image: "/images/photography.jpg",
    tutorial:
      "Start with basic camera settings. Learn lighting techniques and composition rules like rule of thirds. Edit photos using Lightroom or Snapseed.",
  },
  {
    name: "App Development",
    description:
      "Develop mobile apps using React Native and other modern tools.",
    image: "/images/app-development.jpg",
    tutorial:
      "Begin with JavaScript. Learn React Native CLI and Expo. Build simple apps like to-do lists or weather apps. Explore Firebase for backend.",
  },
  {
    name: "UI/UX Design",
    description:
      "Design intuitive interfaces using tools like Figma, XD, and Sketch.",
    image: "/images/ui-ux.jpg",
    tutorial:
      "Study design principles like contrast, alignment, and proximity. Use Figma to create wireframes and prototypes. Gather feedback and iterate.",
  },
];

function Skills() {
  const skillCards = useMemo(
    () =>
      skills.map((skill, index) => (
        <Col xs={12} sm={6} md={4} key={index} className="mb-4">
          <Card className="h-100">
            <Card.Img
              variant="top"
              src={skill.image}
              alt={skill.name}
              height="160"
              style={{ objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "/images/placeholder.jpg";
              }}
            />
            <Card.Body className="d-flex flex-column">
              <Card.Title>{skill.name}</Card.Title>
              <Card.Text className="flex-grow-1">{skill.description}</Card.Text>
              <Button
                variant="outline-primary"
                size="sm"
                as={Link}
                to={`/skills/${index}`}
                className="mt-auto"
              >
                Details
              </Button>
            </Card.Body>
          </Card>
        </Col>
      )),
    []
  );

  return (
    <Container className="py-5">
      <h2 className="text-center fw-bold mb-4">Trading Skills</h2>
      <Row>{skillCards}</Row>
    </Container>
  );
}

export default Skills;
