import React from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Card, CardMedia, CardContent } from "@mui/material";

const skillData = [
  {
    name: "Web Development",
    description: "Build responsive websites using HTML, CSS, JavaScript, and frameworks like React.",
    image: "/images/web-development.jpg",
  },
  {
    name: "Graphic Design",
    description: "Create stunning visuals using Photoshop, Illustrator, and Figma.",
    image: "/images/graphic-design.jpg",
  },
  {
    name: "Digital Marketing",
    description: "Master SEO, social media marketing, and analytics to grow your presence.",
    image: "/images/digital-marketing.jpg",
  },
  {
    name: "Photography",
    description: "Learn lighting, composition, and editing for capturing amazing shots.",
    image: "/images/photography.jpg",
  },
  {
    name: "Public Speaking",
    description: "Gain confidence and clarity in speaking to audiences of all sizes.",
    image: "/images/public-speaking.jpg",
  },
  {
    name: "App Development",
    description: "Develop mobile apps for Android and iOS using modern tools like React Native.",
    image: "/images/app-development.jpg",
  },
  {
    name: "Video Editing",
    description: "Create polished videos using Adobe Premiere Pro, Final Cut, or DaVinci Resolve.",
    image: "/images/video-editing.jpg",
  },
  {
    name: "UI/UX Design",
    description: "Design intuitive interfaces and user experiences with tools like Figma and XD.",
    image: "/images/ui-ux.jpg",
  },
  {
    name: "Content Writing",
    description: "Craft compelling content for blogs, websites, and social media platforms.",
    image: "/images/content-writing.jpg",
  },
  {
    name: "Music Production",
    description: "Produce beats, record vocals, and mix tracks with tools like FL Studio or Ableton.",
    image: "/images/music-production.jpg",
  },
];

function SkillDetails() {
  const { id } = useParams();
  const skill = skillData[id];

  if (!skill) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h5">Skill not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={skill.image}
          alt={skill.name}
        />
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            {skill.name}
          </Typography>
          <Typography variant="body1">{skill.description}</Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SkillDetails;
