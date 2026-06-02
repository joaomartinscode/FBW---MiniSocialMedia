import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DEFAULT_AVATAR } from '../lib/constants.js';
import { authHeaders } from '../lib/auth.js';

export default function SidebarFriends({ currentUserId }) {
    const [friends, setFriends] = useState(null);

    useEffect(() => {
        if (!currentUserId) return;

        const fetchFriends = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/friends/${currentUserId}`,
                    authHeaders()
                );
                setFriends(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Erro ao carregar lista de amigos:", err);
                setFriends([]);
            }
        };

        fetchFriends();
    }, [currentUserId]);

    return (
        <aside className="p-3 h-100 friends-sidebar">
            <h3 className="fw-bold text-dark fs-6 mb-4 px-2">Friends</h3>

            {friends === null ? null : friends.length === 0 ? (
                <p className="text-muted small">You do not have any friends yet.</p>
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
                                {friend.FriendName ?? 'Unknown User'}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}