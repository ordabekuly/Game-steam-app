// src/pages/Dashboard.jsx

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import backgroundImage from '../assets/background.jpg';

function Dashboard() {
    const user = useSelector((state) => state.auth.user);

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed text-white"
            style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${backgroundImage})`
            }}
        >
            <div className="max-w-3xl mx-auto mt-20 p-8 bg-gray-800 bg-opacity-90 shadow-xl rounded-2xl">
                <h1 className="text-4xl font-bold mb-6 text-purple-400">Admin Dashboard</h1>

                <p className="text-gray-300 mb-8 text-lg">
                    Welcome, <span className="font-semibold text-blue-400">{user?.name}</span>!<br />
                    You are logged in as <strong className="text-green-400">{user?.role}</strong>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    {user && user.role === 'admin' && (
                        <Link to="/manage-users" className="w-full sm:w-auto">
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md transition-all">
                                Manage Users
                            </button>
                        </Link>
                    )}

                    {user && (user.role === 'developer' || user.role === 'admin') && (
                        <Link to="/add-game" className="w-full sm:w-auto">
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-all">
                                Add Game
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
