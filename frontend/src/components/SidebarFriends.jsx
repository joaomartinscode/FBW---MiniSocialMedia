import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DEFAULT_AVATAR } from '../constants.js';

export default function SidebarFriends({ currentUserId }) {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUserId) return;

        const fetchFriends = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:3000/api/friends/${currentUserId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setFriends(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Erro ao carregar lista de amigos:", err);
                setFriends([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [currentUserId]);

    return (
        <aside className="p-3 h-100 friends-sidebar">
            <h3 className="fw-bold text-dark fs-6 mb-4 px-2">Amigos</h3>

            {loading ? (
                <div className="px-1 py-2 text-center">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            ) : friends.length === 0 ? (
                <p className="text-muted small">Ainda não tens amigos.</p>
            ) : (
                <ul className="list-unstyled d-flex flex-column gap-3">
                    {friends.map((friend) => (
                        <li key={friend.FriendID} className="d-flex align-items-center gap-2 overflow-hidden">
                            <img 
                                src={DEFAULT_AVATAR} 
                                alt="Friend" 
                                className="rounded-circle flex-shrink-0" 
                                style={{ width: '32px', height: '32px', objectFit: 'cover' }} 
                            />
                            <Link
                                to={`/profile/${friend.FriendID}`}
                                className="fw-medium text-dark text-truncate text-decoration-none small"
                            >
                                {friend.FriendName ?? "Utilizador Desconhecido"}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}