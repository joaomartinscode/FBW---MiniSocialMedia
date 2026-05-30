import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './ui/Button.jsx';

export default function EditProfileModal({ show, onClose, user, onProfileUpdated }) {
    const [fullName, setFullName] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');

    useEffect(() => {
        if (show && user) {
            setFullName(user.FullName || '');
            setIsPublic(user.IsPublicProfile === true || user.IsPublicProfile === 1);
            setEmail(user.Email || '');
            
            if (user.Birthdate) {
                const date = new Date(user.Birthdate);
                setBirthdate(date.toISOString().split('T')[0]);
            } else {
                setBirthdate('');
            }
        }
    }, [show, user]);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName.trim() || !email.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const userId = user.UserID;

            const payload = {
                FullName: fullName.trim(),
                Email: email.trim(),
                IsPublicProfile: isPublic,
                Birthdate: birthdate || null
            };

            await axios.put(`http://localhost:3000/api/users/${userId}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            onProfileUpdated({
                ...user,
                FullName: fullName.trim(),
                Email: email.trim(),
                IsPublicProfile: isPublic,
                Birthdate: birthdate ? new Date(birthdate).toISOString() : null
            });
            onClose();
        } catch (err) {
            console.error('Erro ao editar perfil:', err);
            alert('Não foi possível editar o perfil. Tenta novamente.');
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold text-dark fs-5">Editar Perfil</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body text-start">
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Nome Completo</label>
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Email</label>
                                <input
                                    type="email"
                                    className="form-control rounded-3"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">Data de Nascimento</label>
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
                                    <option value={1}>Perfil Público</option>
                                    <option value={0}>Perfil Privado</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 rounded-pill text-white fw-bold py-2"
                                    disabled={!fullName.trim() || !email.trim()}
                                >
                                    Guardar Alterações
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
