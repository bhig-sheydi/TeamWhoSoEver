import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div>
            <h2 className="text-2xl font-bold text-green-500">Learn Support</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Empowering children with dyslexia through innovative learning tools.
            </p>
          </div>

    
          <div>
            <h3 className="text-xl font-semibold text-green-500">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="#" className="hover:text-green-500 transition">Home</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition">Programs</a>
              </li>

            </ul>
          </div>

          
          <div>
            <h3 className="text-xl font-semibold text-green-500">Get in Touch</h3>
            <p className="mt-2 text-gray-700 dark:text-gray-300">Email: support@bloomlearning.com</p>
            <p className="text-gray-700 dark:text-gray-300">Phone: +123 456 7890</p>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-green-500 hover:scale-110 transition">📘</a>
              <a href="#" className="text-green-500 hover:scale-110 transition">🐦</a>
              <a href="#" className="text-green-500 hover:scale-110 transition">📷</a>
            </div>
          </div>
        </div>

        
        <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
          <p>© {new Date().getFullYear()} Learn Support. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
