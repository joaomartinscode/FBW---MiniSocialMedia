import { Link } from 'react-router-dom';
import Button from './ui/Button.jsx';
import { DEFAULT_AVATAR } from '../lib/constants.js';

export default function SidebarSuggestions({ suggestions = [], sentRequests = [], onAddFriend }) {
    if (suggestions == null || sentRequests == null) return null;

    const sentIds = new Set(sentRequests.map((req) => Number(req.FriendID || req.UserID)));

    return (
        <aside className="p-3">
            <h3 className="fw-bold text-dark fs-6 mb-4 px-1">Suggestions</h3>

            {suggestions.length === 0 ? (
                <p className="text-muted small px-1">No suggestions yet.</p>
            ) : (
                <ul className="list-unstyled d-flex flex-column gap-3">
                    {suggestions.map((user) => {
                        const userId = Number(user.UserID);
                        const isSent = sentIds.has(userId);

                        return (
                            <li key={userId} className="d-flex align-items-center justify-content-between gap-2">
                                <div className="d-flex align-items-center gap-2 overflow-hidden flex-grow-1">
                                    <img 
                                        src={DEFAULT_AVATAR} 
                                        alt={user.FullName} 
                                        className="rounded-circle flex-shrink-0" 
                                        style={{ width: '32px', height: '32px', objectFit: 'cover' }} 
                                    />
                                    <Link
                                        to={`/profile/${userId}`}
                                        className="fw-medium text-dark text-truncate text-decoration-none small"
                                        title={user.FullName}
                                    >
                                        {user.FullName || 'User'}
                                    </Link>
                                </div>

                                <Button
                                    variant="primary"
                                    className="btn-sm rounded-pill px-2 text-white flex-shrink-0 fw-bold"
                                    style={{ fontSize: '0.7rem', minWidth: '75px' }}
                                    disabled={isSent}
                                    onClick={() => onAddFriend(userId)}
                                >
                                    {isSent ? 'Sent' : 'Add Friend'}
                                </Button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </aside>
    );
}