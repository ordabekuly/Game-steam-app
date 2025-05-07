// src/pages/EditGame.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../utils/axiosConfig';
import { updateGame } from '../redux/gameReducer';
import { toast } from 'react-toastify';

function EditGame() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [game, setGame] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
            toast.error('Access denied');
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        axios.get(`/games/${id}`)
            .then((res) => {
                const data = res.data;
                if (user.role === 'developer' && data.developerId !== user.id) {
                    toast.error('You can only edit your own games.');
                    navigate('/dashboard');
                } else {
                    setGame(data);
                    setName(data.name);
                    setPrice(data.price);
                    setDescription(data.description);
                }
            })
            .catch((error) => {
                console.error('Error fetching game:', error);
                toast.error('Failed to load game');
            });
    }, [id, user, navigate]);

    const handleSave = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        if (image) formData.append('image', image);

        try {
            const res = await axios.put(`/games/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            dispatch(updateGame(res.data));
            toast.success('Game updated successfully!');
            navigate(`/games/${id}`);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update game');
        }
    };

    if (!game) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <p className="text-white text-xl">Loading game data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4 py-8">
            <form onSubmit={handleSave} className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-xl shadow-xl space-y-6">
                <h1 className="text-3xl font-bold text-center text-blue-400 mb-4">Edit Game</h1>

                <div>
                    <label className="block text-gray-300 mb-1">Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-1">Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-1">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 mb-1">Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full p-2 text-white bg-gray-700 rounded-lg border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-gray-900 hover:file:bg-blue-700"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full font-semibold transition duration-200 shadow-md"
                >
                    Save Changes
                </button>

                <button
                    type="button"
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-full font-semibold transition duration-200"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default EditGame;
