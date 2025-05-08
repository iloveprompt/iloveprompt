
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {currentYear} iloveprompt. Admin Dashboard
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/admin/logs" className="text-sm hover:text-white transition-colors">
              System Logs
            </Link>
            <Link to="/admin/documentation" className="text-sm hover:text-white transition-colors">
              Documentation
            </Link>
            <Link to="/admin/support" className="text-sm hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminDashboardFooter;
