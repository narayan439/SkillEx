import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <main>
        <Outlet /> {/* This renders the public page components */}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;