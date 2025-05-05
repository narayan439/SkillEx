import React, { useState } from 'react';
import { Search, Star, ChevronRight, User } from 'lucide-react';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedProfiles, setConnectedProfiles] = useState([]);
  const [activeSection, setActiveSection] = useState('forYou');

  const popularSkills = [
    'Web Development',
    'Machine Learning',
    'Graphic Design',
    'Soft Skills',
    'Others'
  ];

  const profiles = [
    {
      id: 1,
      name: 'Narayan sahu',
      rating: 5,
      position: 'Computer Science student specialising in data science and machine learning',
      skills: ['Machine Learning', 'Python', 'Data Science', 'English'],
      avatar: '/avatar1.jpg'
    },
    {
      id: 2,
      name: 'Anil Khosla',
      rating: 4,
      position: 'Professor - Maths 2 @ IIT Raipur. Specialising in Algebra',
      skills: ['Mathematics', 'Algebra', 'Arithmetic'],
      avatar: '/avatar2.jpg'
    }
  ];

  const handleConnect = (profileId) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!connectedProfiles.includes(profileId)) {
      setConnectedProfiles([...connectedProfiles, profileId]);
      alert(`Successfully connected with ${profile.name}`);
    } else {
      setConnectedProfiles(connectedProfiles.filter(id => id !== profileId));
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const query = searchQuery.toLowerCase();
    return (
      profile.name.toLowerCase().includes(query) ||
      profile.position.toLowerCase().includes(query) ||
      profile.skills.some(skill => skill.toLowerCase().includes(query))
    );
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={i < rating ? "text-warning" : "text-muted"} 
        size={16}
        fill={i < rating ? "currentColor" : "none"}
      />
    ));
  };

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="bg-dark text-white p-4" style={{ width: '280px' }}>
        <div className="d-flex align-items-center mb-5">
          <div className="bg-primary rounded p-2 me-3">
            <User size={24} className="text-white" />
          </div>
          <h1 className="fw-bold mb-0">SKILLEX</h1>
        </div>
        
        <div className="mb-5">
          <h5 
            className={`fw-medium mb-3 d-flex align-items-center ${activeSection === 'forYou' ? 'text-primary' : 'text-white'}`}
            onClick={() => setActiveSection('forYou')}
            style={{ cursor: 'pointer' }}
          >
            <ChevronRight size={18} className="me-2" />
            For You
          </h5>
        </div>
        
        <div className="mb-4">
          <h5 className="fw-medium mb-3 text-muted">POPULAR SKILLS</h5>
          <ul className="list-unstyled">
            {popularSkills.map((skill, index) => (
              <li key={index} className="mb-2 ps-3 py-2 rounded hover-bg-gray-800" style={{ cursor: 'pointer' }}>
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Search Bar */}
        <div className="bg-white p-4 shadow-sm">
          <div className="position-relative mx-auto" style={{ maxWidth: '600px' }}>
            <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
              <Search className="text-muted" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search mentors, skills, or topics..."
              className="form-control rounded-pill ps-5 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow-1 p-4">
          <h2 className="text-dark mb-4 fw-bold">For You</h2>
          
          <div className="row g-4">
            {filteredProfiles.map(profile => (
              <div key={profile.id} className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start">
                      <div className="rounded-circle border border-3 border-primary me-4" style={{ width: '80px', height: '80px', overflow: 'hidden' }}>
                        <img src={profile.avatar} className="img-fluid w-100 h-100 object-fit-cover" alt={profile.name} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h3 className="fw-bold mb-1">{profile.name}</h3>
                            <div className="d-flex mb-2">
                              {renderStars(profile.rating)}
                            </div>
                          </div>
                          <button 
                            className={`btn btn-sm ${connectedProfiles.includes(profile.id) ? 'btn-success' : 'btn-outline-primary'}`}
                            onClick={() => handleConnect(profile.id)}
                          >
                            {connectedProfiles.includes(profile.id) ? 'Connected' : 'Connect'}
                          </button>
                        </div>
                        <p className="text-muted mb-3">{profile.position}</p>
                        
                        <div>
                          <h6 className="fw-bold mb-2">SKILLS</h6>
                          <div className="d-flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                              <span key={index} className="badge bg-light text-dark border">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-top-0 text-end">
                    <button className="btn btn-link text-primary text-decoration-none">
                      View Full Profile <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;