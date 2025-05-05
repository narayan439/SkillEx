import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const PrivateLayout = () => {
  return (
    <div className="private-layout">
      <Navbar />
      <main>
        <Outlet /> {/* This renders the authenticated page components */}
      </main>
    </div>
  );
};

export default PrivateLayout;