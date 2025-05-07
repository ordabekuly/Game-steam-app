// src/pages/AddGame.jsx

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { addGame } from '../redux/gameReducer';
import { toast } from 'react-toastify';

function AddGame() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
            toast.error('Access denied');
            navigate('/login');
            return;
        }

        axios.get('http://localhost:8080/categories')
            .then((res) => setCategories(res.data))
            .catch((err) => {
                console.error('Error fetching categories:', err);
                if (err.response?.status === 401) {
                    toast.error('Unauthorized: Please log in again');
                    navigate('/login');
                } else {
                    toast.error('Failed to load categories');
                }
            });
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            toast.error('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('category_id', categoryId);
        formData.append('image', image);
        formData.append('developerId', user.id);

        try {
            const res = await axios.post('/games', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            dispatch(addGame(res.data));
            toast.success('Game added successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error adding game:', error);
            if (error.response?.status === 401) {
                toast.error('Unauthorized: Please log in again');
                navigate('/login');
            } else {
                toast.error('Failed to add game');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start pt-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-yellow-300">Add New Game</h1>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-gray-700">
                <label className="block text-sm text-gray-300">
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 bg-gray-700 border border-gray-600 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                    />
                </label>

                <label className="block text-sm text-gray-300">
                    Price:
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 bg-gray-700 border border-gray-600 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                    />
                </label>

                <label className="block text-sm text-gray-300">
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 bg-gray-700 border border-gray-600 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </label>

                <label className="block text-sm text-gray-300">
                    Category:
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="mt-1 bg-gray-700 border border-gray-600 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block text-sm text-gray-300">
                    Image:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="mt-1 bg-gray-700 border border-gray-600 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-gray-900 hover:file:bg-yellow-500"
                        required
                    />
                </label>

                <button
                    type="submit"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-full transition duration-200"
                >
                    Add Game
                </button>
            </form>
        </div>
    );
}

export default AddGame;
