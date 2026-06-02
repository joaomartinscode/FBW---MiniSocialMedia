import { useState } from 'react';
import axios from 'axios';
import Button from './ui/Button.jsx';
import { authHeaders } from '../lib/auth.js';

export default function EditProfileModal({ show, onClose, user, onProfileUpdated }) {
    const [fullName, setFullName] = useState(user?.FullName || '');
    const [isPublic, setIsPublic] = useState(user?.IsPublicProfile === true || user?.IsPublicProfile === 1);
    const [email, setEmail] = useState(user?.Email || '');
    const [birthdate, setBirthdate] = useState(user?.Birthdate ? new Date(user.Birthdate).toISOString().split('T')[0] : '');
    const [error, setError] = useState('');

    if (!show) return null;

    const hasChanges = user ? (
        fullName.trim() !== user.FullName ||
        email.trim() !== user.Email ||
        isPublic !== (user.IsPublicProfile === true || user.IsPublicProfile === 1) ||
        birthdate !== (user.Birthdate ? new Date(user.Birthdate).toISOString().split('T')[0] : '')
    ) : false;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!hasChanges) {
            onClose();
            return;
        }

        if (birthdate) {
            const birthDateObj = new Date(birthdate);
            const today = new Date();
            let age = today.getFullYear() - birthDateObj.getFullYear();
            const m = today.getMonth() - birthDateObj.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
                age--;
            }

            if (age < 18) {
                setError('You must be at least 18 years old.');
                return;
            }
        }

        try {
            const userId = user.UserID;

            const payload = {};
            if (fullName.trim() !== user.FullName) payload.FullName = fullName.trim();
            if (email.trim() !== user.Email) payload.Email = email.trim();
            if (isPublic !== (user.IsPublicProfile === true || user.IsPublicProfile === 1)) payload.IsPublicProfile = isPublic;
            if (birthdate !== (user.Birthdate ? new Date(user.Birthdate).toISOString().split('T')[0] : '')) payload.Birthdate = birthdate || null;

            await axios.put(`http://localhost:3000/api/users/${userId}`, payload, {
                ...authHeaders()
            });

            onProfileUpdated({
                ...user,
                ...(payload.FullName !== undefined && { FullName: payload.FullName }),
                ...(payload.Email !== undefined && { Email: payload.Email }),
                ...(payload.IsPublicProfile !== undefined && { IsPublicProfile: payload.IsPublicProfile }),
                ...(payload.Birthdate !== undefined && { Birthdate: payload.Birthdate ? new Date(payload.Birthdate).toISOString() : null })
            });
            onClose();
        } catch (err) {
            console.error('Error editing profile:', err);
            setError(err.response?.data?.message || 'Could not edit the profile. Please try again.');
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold text-dark fs-5">Edit Profile</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body text-start">
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Email</label>
                                <input
                                    type="email"
                                    className="form-control rounded-3"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Birthdate</label>
                                <input
                                    type="date"
                                    className="form-control rounded-3"
                                    value={birthdate}
                                    onChange={(e) => setBirthdate(e.target.value)}
                                />
                            </div>

                            <div className="d-flex align-items-center gap-2 mt-3 bg-light p-2 rounded-3" style={{ width: 'fit-content' }}>
                                <i className={`bi ${isPublic ? 'bi-globe2' : 'bi-lock-fill'} text-secondary small`}></i>
                                <select
                                    className="form-select form-select-sm border-0 bg-transparent py-0 fw-semibold text-secondary"
                                    style={{ boxShadow: 'none', cursor: 'pointer' }}
                                    value={isPublic ? 1 : 0}
                                    onChange={(e) => setIsPublic(Number(e.target.value) === 1)}
                                >
                                    <option value={1}>Public Profile</option>
                                    <option value={0}>Private Profile</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 rounded-pill text-white fw-bold py-2"
                                    disabled={!hasChanges}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}