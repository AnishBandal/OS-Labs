import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="py-6">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">OS Lab Visualizer</h1>
        </Link>
        <nav className="flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">Home</Link>
          <Link to="/disk-scheduling" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400">Disk Scheduling</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;