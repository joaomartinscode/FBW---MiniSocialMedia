import { useState, useEffect } from 'react';
import axios from 'axios';
import { DEFAULT_AVATAR } from '../constants.js';

export default function CommentItem({ comment, postId, refreshComments, depth = 1 }) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [likes, setLikes] = useState({ count: 0, hasLiked: false });

    const token = localStorage.getItem('token');
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/likes/count?commentId=${comment.CommentID}`, authHeaders);
                setLikes({ count: res.data.totalLikes, hasLiked: res.data.hasLiked });
            } catch (err) {}
        };
        fetchLikes();
    }, [authHeaders, comment.CommentID]);

    const handleLike = async () => {
        try {
            const res = await axios.post(`http://localhost:3000/api/likes/toggle`, { commentId: comment.CommentID }, authHeaders);
            setLikes(prev => ({
                hasLiked: res.data.liked,
                count: res.data.liked ? prev.count + 1 : prev.count - 1
            }));
        } catch (err) {}
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            await axios.post('http://localhost:3000/api/comments', {
                postId: Number(postId),
                parentCommentId: comment.CommentID,
                content: replyText
            }, authHeaders);

            setReplyText('');
            setIsReplying(false);
            refreshComments();
        } catch (err) {
            alert("Erro ao responder.");
        }
    };

    return (
        <div className="comment-item d-flex flex-column">
            <div className="d-flex gap-2 align-items-start">
                <img src={DEFAULT_AVATAR} alt="Avatar" className="rounded-circle flex-shrink-0" style={{width: '32px', height: '32px', objectFit: 'cover'}} />

                <div className="flex-grow-1">
                    <div className="bg-light px-3 py-2 rounded-4 d-inline-block" style={{maxWidth: '100%'}}>
                        <div className="fw-bold small" style={{fontSize: '0.85rem'}}>
                            {comment.user?.FullName || "Utilizador"}
                        </div>
                        <div className="small text-break">{comment.Content}</div>
                    </div>

                    <div className="d-flex gap-3 mt-1 ms-2" style={{fontSize: '0.75rem'}}>
                        {comment.CreatedAt && (
                            <span className="text-muted">
                                {new Date(comment.CreatedAt).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                        )}
                        <button
                            className={`btn btn-sm p-0 fw-bold border-0 ${likes.hasLiked ? 'text-primary' : 'text-secondary'}`}
                            onClick={handleLike}
                        >
                            Gosto {likes.count > 0 && `(${likes.count})`}
                        </button>

                        {}
                        {depth < 4 && (
                            <button
                                className="btn btn-sm p-0 fw-bold text-secondary border-0"
                                onClick={() => setIsReplying(!isReplying)}
                            >
                                Responder
                            </button>
                        )}
                    </div>

                    {isReplying && (
                        <form onSubmit={handleReplySubmit} className="mt-2">
                            <input
                                autoFocus
                                className="form-control form-control-sm rounded-pill bg-light"
                                placeholder="Escreve uma resposta..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                        </form>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                        <div className="replies-container mt-2 border-start ps-3">
                            {comment.replies.map(reply => (
                                <CommentItem
                                    key={reply.CommentID}
                                    comment={reply}
                                    postId={postId}
                                    refreshComments={refreshComments}
                                    depth={depth + 1} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}