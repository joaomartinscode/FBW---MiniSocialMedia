import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './ui/Button.jsx';
import { DEFAULT_AVATAR } from '../lib/constants.js';
import { authHeaders, getStoredUserId } from '../lib/auth.js';

export default function CreatePostModal({ show, onClose, onPostCreated }) {
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(1);
    const [userName, setUserName] = useState(localStorage.getItem('userFullName') || '');

    const userId = getStoredUserId();

    useEffect(() => {
        if (!show || !userId) return;

        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/users/${userId}`, authHeaders());
                setUserName(response.data.FullName || 'User');
            } catch (err) {
                console.error('Error loading user:', err);
            }
        };

        fetchUser();
    }, [show, userId]);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            const payload = {
                Content: content.trim(),
                IsPublic: Number(isPublic)
            };

            const response = await axios.post('http://localhost:3000/api/posts', payload, {
                ...authHeaders()
            });

            
            onPostCreated(response.data);

            setContent('');
            setIsPublic(1);
            onClose();
        } catch (err) {
            console.error('Error creating post:', err);

            const status = err?.response?.status;
            if (status === 401) {
                alert('Error 401: You are not authenticated or your token has expired.');
            } else {
                alert('Could not create the post. Please try again.');
            }
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold text-dark fs-5">Create Post</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body text-start">
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <img 
                                    src={DEFAULT_AVATAR} 
                                    alt="User" 
                                    className="rounded-circle" 
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                                />
                                <span className="fw-semibold">{userName}</span>
                            </div>

                            <textarea
                                className="form-control border-0 px-2 animate-focus-none"
                                rows="4"
                                style={{ resize: 'none', fontSize: '1.1rem', boxShadow: 'none' }}
                                placeholder="What's on your mind?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />

                            <div className="d-flex align-items-center gap-2 mt-3 bg-light p-2 rounded-3" style={{ width: 'fit-content' }}>
                                <i className={`bi ${isPublic === 1 ? 'bi-globe2' : 'bi-lock-fill'} text-secondary small`}></i>
                                <select
                                    className="form-select form-select-sm border-0 bg-transparent py-0 fw-semibold text-secondary"
                                    style={{ boxShadow: 'none', cursor: 'pointer' }}
                                    value={isPublic}
                                    onChange={(e) => setIsPublic(Number(e.target.value))}
                                >
                                    <option value={1}>Public</option>
                                    <option value={0}>Private</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 rounded-pill text-white fw-bold py-2"
                                    disabled={!content.trim()}
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}