import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "./ui/Button.jsx";
import Logo from "../assets/images/LOGO.svg";
import { DEFAULT_AVATAR } from "../constants.js";

export default function Navbar({ onNewPostClick }) {
    const [showNotif, setShowNotif] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);

    const userId = localStorage.getItem('userId');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    };

    useEffect(() => {
        const fetchPendingRequests = async () => {
            if (!userId) return;
            try {
                const response = await axios.get(`http://localhost:3000/api/friends/${userId}/pending`, getAuthHeaders());
                setPendingRequests(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error('Erro ao carregar pendentes:', err);
                setPendingRequests([]);
            }
        };

        fetchPendingRequests();
    }, [userId]);

    const handleAcceptFriend = async (friendId) => {
        try {
            await axios.put(`http://localhost:3000/api/friends/${userId}/accept/${friendId}`, {}, getAuthHeaders());
            setPendingRequests((prev) => prev.filter((p) => Number(p.UserID) !== Number(friendId)));
        } catch (err) {
            console.error('Erro ao aceitar pedido:', err);
        }
    };

    const handleRejectFriend = async (friendId) => {
        try {
            await axios.delete(`http://localhost:3000/api/friends/${userId}/remove/${friendId}`, getAuthHeaders());
            setPendingRequests((prev) => prev.filter((p) => Number(p.UserID) !== Number(friendId)));
        } catch (err) {
            console.error('Erro ao rejeitar pedido:', err);
        }
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

                    <div className="position-relative">
                        <Button
                            icon="bi bi-bell"
                            onClick={() => setShowNotif((s) => !s)}
                            variant="icon-outline"
                            size="fs-2"
                        />

                        {showNotif && (
                            <div className="position-absolute end-0 mt-2 bg-white shadow rounded-3 p-3" style={{ minWidth: '280px', zIndex: 2000 }}>
                                <h6 className="fw-semibold mb-3">Notificações</h6>

                                {pendingRequests.length === 0 ? (
                                    <p className="text-muted mb-0">Sem pedidos pendentes.</p>
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
                                                    Aceitar
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleRejectFriend(req.UserID)}
                                                >
                                                    Recusar
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <Button
                        to={`/profile/${userId}`}
                        icon="bi bi-person-circle"
                        variant="icon-outline"
                        size="fs-2"
                    />
                </div>
            </div>
        </nav>
    );
}