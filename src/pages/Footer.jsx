// src/pages/Footer
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Сол жақ: Копирайт */}
                    <div className="mb-4 md:mb-0">
                        <p>© {new Date().getFullYear()} Game Platform. All rights reserved.</p>
                    </div>

                    {/* Орта: Навигация сілтемелері */}
                    <div className="flex space-x-4 mb-4 md:mb-0">
                        <Link to="/" className="hover:text-blue-400 transition-colors duration-200">
                            Home
                        </Link>
                        <Link to="/about" className="hover:text-blue-400 transition-colors duration-200">
                            About
                        </Link>
                        <Link to="/contact" className="hover:text-blue-400 transition-colors duration-200">
                            Contact
                        </Link>
                        <Link to="/privacy" className="hover:text-blue-400 transition-colors duration-200">
                            Privacy Policy
                        </Link>
                    </div>

                    {/* Оң жақ: Әлеуметтік желілер */}
                    <div className="flex space-x-4">
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition-colors duration-200"
                        >
                            Twitter
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition-colors duration-200"
                        >
                            Facebook
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-400 transition-colors duration-200"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;