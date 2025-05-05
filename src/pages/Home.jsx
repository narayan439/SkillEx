import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  const [isHoverExplore, setIsHoverExplore] = useState(false);
  const [isHoverRead, setIsHoverRead] = useState(false);

  const buttonStyle = (hover) => ({
    backgroundColor: hover ? "#145ca8" : "#1976d2",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    transition: "background-color 0.3s ease",
    cursor: "pointer"
  });

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section className="text-center" style={{ padding: 0, margin: 0 }}>
        <h1 className="display-4 fw-bold mb-3 mt-5">Exchange Skills Virtually!</h1>
        <p className="text-muted mb-4">
          We believe in the power of collaborative learning and the transformative potential of skill exchange.
        </p>
        <button
          className="mb-4"
          style={buttonStyle(isHoverExplore)}
          onMouseEnter={() => setIsHoverExplore(true)}
          onMouseLeave={() => setIsHoverExplore(false)}
        >
          Explore Skills
        </button>

        <div style={{ margin: 10, padding: 10 }}>
          <img
            src="/images/image-laptop.png"
            alt="Collaboration"
            className="img-fluid rounded shadow"
            style={{
              width: "100vw",
              height: "600px",
              objectFit: "cover",
              display: "block",
              borderRadius: "0",
            }}
          />
        </div>
      </section>

      {/* Community Section */}
      <section className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src="/images/Community Hands.png"
              alt="Community Hands"
              className="img-fluid shadow"
              style={{
                height: "500px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">
              Empowering Connections On Our Virtual Skills Exchange Platform
            </h2>
            <p className="text-muted">
              Welcome to Our Community! Our platform connects individuals worldwide who are passionate about expanding their knowledge, sharing expertise, and learning from others in a supportive environment.
            </p>
            <button
              style={buttonStyle(isHoverRead)}
              onMouseEnter={() => setIsHoverRead(true)}
              onMouseLeave={() => setIsHoverRead(false)}
            >
              Read more
            </button>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      {/* Mission & Vision Section */}
{/* Mission & Vision Section */}
<section style={{ backgroundColor: "#E3F3F7" }} className="py-5">
  <div className="container">
    <h3 className="fw-bold mb-2">Our Mission</h3>
    <h5 className="text-muted mb-3">Empowering Global Skill Exchange</h5>
    <p className="text-muted mb-4">
      We are dedicated to fostering a vibrant community where individuals can exchange skills, knowledge,
      and experiences in a virtual environment.
    </p>

    <h3 className="fw-bold mb-2">Our Vision</h3>
    <h5 className="text-muted mb-3">Transforming Global Learning Through Skill Exchange</h5>
    <p className="text-muted">
      We envision a world where every individual, regardless of location, has access to quality learning experiences.
    </p>
  </div>
</section>


    </div>
  );
};

export default HomePage;
