// src/pages/GameDetail
// src/pages/GameDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../utils/axiosConfig';
import ReviewForm from '../components/ReviewForm';
import { toast } from 'react-toastify';
import backgroundImage from '../assets/background.jpg';

function GameDetail() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [ownsGame, setOwnsGame] = useState(false);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        axios.get(`/games/${id}`)
            .then((res) => setGame(res.data))
            .catch((err) => {
                console.error('Error fetching game:', err);
                toast.error('Failed to load game');
            });

        axios.get(`/reviews?gameId=${id}`)
            .then((res) => setReviews(res.data))
            .catch((err) => {
                console.error('Error fetching reviews:', err);
                toast.error('Failed to load reviews');
            });

        if (user) {
            axios.get('/library')
                .then((res) => {
                    const hasGame = res.data.some((g) => g.id === Number(id));
                    setOwnsGame(hasGame);
                })
                .catch((err) => {
                    console.error('Error checking ownership:', err);
                });
        }
    }, [id, user]);

    const handlePurchase = async () => {
        try {
            await axios.post('/ownership', {
                gameId: Number(id),
                status: 'owned',
            });
            setOwnsGame(true);
            toast.success('Game purchased successfully!');
        } catch (error) {
            console.error('Error purchasing game:', error);
            toast.error('Failed to purchase game');
        }
    };

    const handleReturn = async () => {
        try {
            await axios.delete(`/ownership?gameId=${id}`);
            setOwnsGame(false);
            toast.success('Game returned successfully!');
        } catch (error) {
            console.error('Error returning game:', error);
            toast.error('Failed to return game');
        }
    };

    const handleReviewAdded = () => {
        axios.get(`/reviews?gameId=${id}`)
            .then((res) => setReviews(res.data))
            .catch((err) => {
                console.error('Error fetching reviews:', err);
                toast.error('Failed to load reviews');
            });
    };

    if (!game) return <div className="text-center text-white">Loading...</div>;

    const isEditor =
        user &&
        (user.role === 'admin' || (user.role === 'developer' && user.id === game.developerId));

    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`
            }}
        >
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-purple-400 mb-6">{game.name}</h1>

                        <div className="mt-8 p-6 rounded-lg bg-gray-800 bg-opacity-95 text-white shadow-lg mb-8">
                            <img
                                src={`http://localhost:8080/${game.image}`}
                                alt={game.name}
                                className="w-full h-64 object-cover rounded-lg mb-6"
                            />
                            <p className="text-xl font-semibold text-green-400 mb-4">${game.price.toFixed(2)}</p>
                            <p className="text-white mb-4">{game.description}</p>

                            {isEditor && (
                                <div className="mb-4">
                                    <Link to={`/games/${id}/edit`}>
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2">
                                            Edit Game
                                        </button>
                                    </Link>
                                    <Link to={`/delete-game/${id}`}>
                                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                                            Delete Game
                                        </button>
                                    </Link>
                                </div>
                            )}

                            {user && user.role === 'user' && (
                                <button
                                    onClick={ownsGame ? handleReturn : handlePurchase}
                                    className={`${
                                        ownsGame ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
                                    } text-white px-4 py-2 rounded mb-4 transition-all duration-200`}
                                >
                                    {ownsGame ? 'Return Game' : 'Buy Now'}
                                </button>
                            )}

                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold mb-2">Reviews</h2>
                                {reviews.length === 0 ? (
                                    <p className="text-white">No reviews yet. Be the first to review!</p>
                                ) : (
                                    reviews.map((review) => (
                                        <div key={review.id} className="bg-gray-700 p-4 rounded-lg mb-2">
                                            <p className="text-white">{review.comment}</p>
                                            <p className="text-sm text-gray-400">Rating: {review.rating}/5</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {user && (
                                <ReviewForm gameId={Number(id)} onReviewAdded={handleReviewAdded} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default GameDetail;
