import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Button from './ui/Button.jsx';
import CommentSection from './CommentSection.jsx';
import EditPostModal from './EditPostModal.jsx';
import { DEFAULT_AVATAR } from '../constants.js';
import PostImage from '../assets/images/IMG3.svg';

export default function PostCard({ post, currentUserId, onPostDeleted, onPostUpdated }) {
    const [showComments, setShowComments] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const authorName = post?.users?.FullName || 'Utilizador Desconhecido';

    const menuRef = useRef(null);

    const isOwner = Number(post?.UserID) === Number(currentUserId);
    const postId = post?.PostID;

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    useEffect(() => {
        const fetchLikes = async () => {
            if (!postId) return;
            try {
                const response = await axios.get(`http://localhost:3000/api/likes/count?postId=${postId}`, getAuthHeaders());
                
                setLikesCount(Number(response.data.totalLikes ?? 0));
                setIsLiked(Boolean(response.data.hasLiked ?? false));
            } catch (err) {
                console.error('Erro ao carregar likes:', err);
            }
        };

        fetchLikes();
    }, [postId]);

    useEffect(() => {
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        if (showMenu) document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [showMenu]);

    const handleLikeToggle = async () => {
        if (!postId || isLiking) return;

        const prevLiked = isLiked;
        const prevCount = likesCount;
        setIsLiking(true);
        setIsLiked(!prevLiked);
        setLikesCount(prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1);

        try {
            const payload = { postId, commentId: null };
            const response = await axios.post('http://localhost:3000/api/likes/toggle', payload, getAuthHeaders());
            if (response?.data) {
                if (typeof response.data.liked === 'boolean') setIsLiked(response.data.liked);
                if (typeof response.data.totalLikes === 'number') setLikesCount(response.data.totalLikes);
            }
        } catch (err) {
            console.error('Erro ao processar like:', err);
            setIsLiked(prevLiked);
            setLikesCount(prevCount);
        } finally {
            setIsLiking(false);
        }
    };

    const handleDelete = async () => {
        if (!postId) return;

        if (!window.confirm('Tens a certeza que desejas eliminar este post?')) return;

        try {
            await axios.delete(`http://localhost:3000/api/posts/${postId}`, getAuthHeaders());
            setShowMenu(false);
            if (onPostDeleted) onPostDeleted(postId);
        } catch (err) {
            console.error('Erro ao eliminar post:', err);
            alert('Nao foi possível eliminar o post.');
        }
    };

    const handleEdit = () => {
        if (!postId) return;
        setShowEditModal(true);
        setShowMenu(false);
    };

    return (
        <article className="card border-0 shadow-sm p-4 mb-4 rounded-4 text-start">
            <div className="d-flex align-items-center justify-content-between mb-3 position-relative">
                <div className="d-flex align-items-center gap-2">
                    <img 
                        src={DEFAULT_AVATAR} 
                        alt="Avatar" 
                        className="rounded-circle" 
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                    />
                    <div>
                        <span className="fw-semibold d-block">{authorName}</span>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Publicado {post.CreatedAt ? new Date(post.CreatedAt).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                        </small>
                    </div>
                </div>

                <div className="position-relative" ref={menuRef}>
                    <Button
                        variant="icon-primary"
                        icon="bi bi-three-dots-vertical"
                        className="fs-4 text-dark"
                        onClick={() => setShowMenu((s) => !s)}
                        aria-haspopup="true"
                        aria-expanded={showMenu}
                        aria-label="Open post menu"
                    />

                    {showMenu && (
                        <div className="dropdown-menu show position-absolute end-0 mt-1 shadow-sm border rounded-3 p-1" style={{ zIndex: 1000 }}>
                            {isOwner ? (
                                <>
                                    <button className="dropdown-item rounded-2 text-dark" onClick={handleEdit}>
                                        <i className="bi bi-pencil me-2"></i>Editar
                                    </button>
                                    <button className="dropdown-item rounded-2 text-danger" onClick={handleDelete}>
                                        <i className="bi bi-trash me-2"></i>Eliminar
                                    </button>
                                </>
                            ) : (
                                <button className="dropdown-item rounded-2 text-muted" onClick={() => alert('Denunciado')}>
                                    <i className="bi bi-flag me-2"></i>Denunciar Post
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {}
            <div className="mb-3">
                <img
                    src={PostImage}
                    alt="Post visual"
                    className="w-100 rounded-4"
                    style={{ maxHeight: '420px', objectFit: 'cover' }}
                />
            </div>

            {post.Content && (
                <p className="mb-3 text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                    {post.Content}
                </p>
            )}

            {likesCount > 0 && (
                <div className="mb-2 px-1 text-secondary" style={{ fontSize: '0.85rem' }}>
                    <i className="bi bi-heart-fill text-danger me-1"></i>
                    {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </div>
            )}

            <div className="d-flex gap-2 border-top pt-2">
                <Button
                    variant="outline"
                    icon={isLiked ? 'bi bi-heart-fill' : 'bi bi-heart'}
                    className={`btn-sm rounded-pill px-3 ${isLiked ? 'text-danger border-danger' : ''}`}
                    onClick={handleLikeToggle}
                    disabled={isLiking}
                    aria-pressed={isLiked}
                    aria-label={isLiked ? 'Remover like' : 'Dar like'}
                >
                    {isLiking ? '…' : 'Like'}
                </Button>
                <Button
                    variant="outline"
                    icon="bi bi-chat-left"
                    className="btn-sm rounded-pill px-3"
                    onClick={() => setShowComments((s) => !s)}
                    aria-expanded={showComments}
                    aria-controls={`comments-${postId}`}
                >
                    Comment
                </Button>
            </div>

            {showComments && <CommentSection postId={postId} />}

            <EditPostModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                post={post}
                onPostUpdated={onPostUpdated}
            />
        </article>
    );
}