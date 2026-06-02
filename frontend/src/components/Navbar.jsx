import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "./ui/Button.jsx";
import Logo from "../assets/images/LOGO.svg";
import { DEFAULT_AVATAR } from "../lib/constants.js";
import { authHeaders, getStoredUserId } from "../lib/auth.js";

export default function Navbar({ onNewPostClick }) {
    const [showNotif, setShowNotif] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const navigate = useNavigate();
    
    const userId = getStoredUserId();

    useEffect(() => {
        const fetchPendingRequests = async () => {
            if (!userId) return;
            try {
                const response = await axios.get(`http://localhost:3000/api/friends/${userId}/pending`, authHeaders());
                setPendingRequests(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error('Error loading pending requests:', err);
                setPendingRequests([]);
            }
        };

        fetchPendingRequests();
    }, [userId]);

    const handleAcceptFriend = async (friendId) => {
        try {
            await axios.put(`http://localhost:3000/api/friends/${userId}/accept/${friendId}`, {}, authHeaders());
            setPendingRequests((prev) => prev.filter((p) => Number(p.UserID) !== Number(friendId)));
        } catch (err) {
            console.error('Error accepting request:', err);
        }
    };

    const handleRejectFriend = async (friendId) => {
        try {
            await axios.delete(`http://localhost:3000/api/friends/${userId}/remove/${friendId}`, authHeaders());
            setPendingRequests((prev) => prev.filter((p) => Number(p.UserID) !== Number(friendId)));
        } catch (err) {
            console.error('Error rejecting request:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userFullName');
        navigate('/login');
    };

    return (
        <nav className="w-100 position-relative" style={{ backgroundColor: "#313158", height: "72px" }}>
            <div className="d-flex justify-content-between align-items-center px-4 h-100">

                <Link to="/" className="d-flex align-items-center">
                    <img src={Logo} alt="Wish Facebook Logo" style={{ height: "50px" }} />
                </Link>

                <div className="d-flex align-items-center gap-3 position-relative">
                    <Button
                        icon="bi bi-plus-circle"
                        onClick={onNewPostClick}
                        variant="icon-outline"
                        size="fs-2"
                    />

                    <div 
                        className="position-relative" 
                        onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                setShowNotif(false);
                            }
                        }}
                    >
                        <Button
                            icon="bi bi-bell"
                            onClick={() => setShowNotif((s) => !s)}
                            variant="icon-outline"
                            size="fs-2"
                        />

                        {showNotif && (
                            <div className="position-absolute end-0 mt-2 bg-white shadow rounded-3 p-3" style={{ minWidth: '280px', zIndex: 2000 }}>
                                <h6 className="fw-semibold mb-3">Notifications</h6>

                                {pendingRequests.length === 0 ? (
                                    <p className="text-muted mb-0">No pending requests.</p>
                                ) : (
                                    pendingRequests.map((req) => (
                                        <div key={req.UserID} className="d-flex align-items-center justify-content-between mb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <img 
                                                    src={DEFAULT_AVATAR} 
                                                    alt="User" 
                                                    className="rounded-circle" 
                                                    style={{ width: '32px', height: '32px', objectFit: 'cover' }} 
                                                />
                                                <span>{req.FullName}</span>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleAcceptFriend(req.UserID)}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleRejectFriend(req.UserID)}
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div 
                        className="position-relative" 
                        onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                setShowProfileMenu(false);
                            }
                        }}
                    >
                        <Button
                            icon="bi bi-person-circle"
                            variant="icon-outline"
                            size="fs-2"
                            onClick={() => setShowProfileMenu((s) => !s)}
                        />
                        
                        {showProfileMenu && (
                            <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-sm border rounded-3 p-1" style={{ zIndex: 2000, minWidth: '150px' }}>
                                <Link to={`/profile/${userId}`} className="dropdown-item rounded-2 text-dark" onClick={() => setShowProfileMenu(false)}>
                                    My Profile
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item rounded-2 text-danger" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}