
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
        <p className="text-xl text-gray-600 mb-8">Discover more about our amazing team!</p>
        <Link to="/team">
          <Button className="bg-purple-600 hover:bg-purple-700">
            Meet Our Team
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
