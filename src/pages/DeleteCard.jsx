import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteGame } from '../redux/gameReducer';
import axios from '../utils/axiosConfig';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

function DeleteCard() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        if (user.role !== 'admin' && user.role !== 'developer') {
            toast.error('Access denied!');
            navigate('/dashboard');
            return;
        }

        axios.get(`/games/${id}`)
            .then((res) => {
                const data = res.data;
                if (user.role === 'developer' && data.developerId !== user.id) {
                    toast.error('You can only delete your own games.');
                    navigate('/dashboard');
                } else {
                    setGame(data);
                    setModalIsOpen(true);
                }
            })
            .catch((error) => {
                console.error('Error fetching game:', error);
                toast.error('Failed to load game');
                navigate('/dashboard');
            });
    }, [id, user]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/games/${id}`);
            dispatch(deleteGame(Number(id)));
            toast.success('Game deleted successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error deleting game:', error);
            toast.error('Failed to delete game');
        }
    };

    const handleCancel = () => {
        setModalIsOpen(false);
        setTimeout(() => navigate('/dashboard'), 200);
    };

    if (!game) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <p className="text-white text-xl">Loading game...</p>
            </div>
        );
    }

    return (
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={handleCancel}
            className="bg-gray-800 text-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-fade-in border border-gray-700"
            overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
        >
            <h2 className="text-3xl font-bold text-red-400 mb-4">Delete Game</h2>
            <p className="mb-3 text-gray-200">
                Are you sure you want to delete <strong className="text-yellow-300">{game.name}</strong>?
            </p>
            <p className="text-sm text-gray-400 mb-6">⚠️ This action cannot be undone.</p>

            <div className="flex justify-end gap-4">
                <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full shadow-md transition-all duration-200"
                >
                    Yes, Delete
                </button>
                <button
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-5 py-2 rounded-full shadow-md transition-all duration-200"
                >
                    Cancel
                </button>
            </div>
        </Modal>
    );
}

export default DeleteCard;
