import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './ui/Button.jsx';
import { DEFAULT_AVATAR } from '../constants.js';

export default function CreatePostModal({ show, onClose, onPostCreated }) {
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(1);
    const [userName, setUserName] = useState('');

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!show || !userId) return;

        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserName(response.data.FullName || 'Utilizador');
            } catch (err) {
                console.error('Erro ao carregar utilizador:', err);
            }
        };

        fetchUser();
    }, [show, userId]);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            const token = localStorage.getItem('token');

            const payload = {
                Content: content.trim(),
                IsPublic: Number(isPublic)
            };

            const response = await axios.post('http://localhost:3000/api/posts', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            
            onPostCreated(response.data);

            setContent('');
            setIsPublic(1);
            onClose();
        } catch (err) {
            console.error('Erro ao criar publicação:', err);

            const status = err?.response?.status;
            if (status === 401) {
                alert('Erro 401: Não estás autenticado ou o token expirou.');
            } else {
                alert('Não foi possível criar a publicação. Tenta novamente.');
            }
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 rounded-4 shadow">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold text-dark fs-5">Criar Publicação</h5>
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
                                <span className="fw-semibold">{userName || 'Carregando...'}</span>
                            </div>

                            <textarea
                                className="form-control border-0 px-2 animate-focus-none"
                                rows="4"
                                style={{ resize: 'none', fontSize: '1.1rem', boxShadow: 'none' }}
                                placeholder="No que estás a pensar?"
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
                                    <option value={1}>Público</option>
                                    <option value={0}>Privado</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 rounded-pill text-white fw-bold py-2"
                                    disabled={!content.trim()}
                                >
                                    Publicar
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}