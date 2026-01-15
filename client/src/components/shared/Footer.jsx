import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-sm"> 2025 Hostel Harmony. All rights reserved.</p>
        <p className="text-sm">Follow us on social media:</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="text-gray-400 hover:text-gray-300">
            <FaFacebook />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-300">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-300">
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
