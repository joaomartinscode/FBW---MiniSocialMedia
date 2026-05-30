import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CommentItem from './CommentItem.jsx';

export default function CommentSection({ postId }) {
    const [commentsTree, setCommentsTree] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem('token');
    const userFullName = localStorage.getItem('userFullName') || "Eu";
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchComments = useCallback(async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`http://localhost:3000/api/comments/post/${postId}`, authHeaders);
            setCommentsTree(res.data);
        } catch (err) {
            console.error("Erro ao carregar comentários:", err);
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleAddMainComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        try {
            const res = await axios.post('http://localhost:3000/api/comments', {
                postId: Number(postId),
                content: newCommentText
            }, authHeaders);

            const newObj = {
                CommentID: res.data.commentId,
                Content: newCommentText,
                ParentCommentID: null,
                user: { FullName: userFullName },
                replies: [],
                CreatedAt: new Date().toISOString()
            };

            setCommentsTree(prev => [newObj, ...prev]);
            setNewCommentText('');
        } catch (err) {
            console.error("Erro ao publicar comentários:", err);
        }
    };

    return (
        <div className="comment-section mt-3 pt-3 border-top">
            <form onSubmit={handleAddMainComment} className="mb-4">
                <div className="d-flex gap-2">
                    <div className="avatar-sm bg-secondary rounded-circle flex-shrink-0" style={{width: '32px', height: '32px'}}></div>
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-pill bg-light border-0 px-3"
                        placeholder="Escreve um comentário..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                    />
                </div>
            </form>

            <div className="d-flex flex-column gap-3">
                {isLoading ? (
                    <div className="text-center small text-muted">A carregar...</div>
                ) : commentsTree.length > 0 ? (
                    commentsTree.map(comment => (
                        <CommentItem
                            key={comment.CommentID}
                            comment={comment}
                            postId={postId}
                            refreshComments={fetchComments}
                        />
                    ))
                ) : (
                    <div className="ps-2 small text-muted">Sê o primeiro a comentar!</div>
                )}
            </div>
        </div>
    );
}