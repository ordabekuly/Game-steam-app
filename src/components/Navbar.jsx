// src/components/NavBar.jsx 

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authReducer';

function Navbar() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    // Закрытие меню при клике вне
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="flex justify-between items-center bg-gray-800 p-4 text-white shadow-md">
            <div className="flex items-center space-x-4">
                <Link to="/" className="hover:text-blue-400 transition-colors duration-200">Home</Link>
                {user && (user.role === 'admin' || user.role === 'developer') && (
                    <Link to="/dashboard" className="hover:text-blue-400 transition-colors duration-200">Dashboard</Link>
                )}
            </div>

            <div ref={menuRef}>
                {user ? (
                    <>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 transition"
                        >
                            <span className="text-lg">👤</span>
                            <span className="hidden md:inline">{user.name}</span>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-700">
                                <Link
                                    to="/profile"
                                    className="block px-4 py-2 hover:bg-gray-700 transition-colors"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className=" hover:text-blue-400">Login</Link>
                            <Link to="/register" className="hover:text-blue-400">Register</Link>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;