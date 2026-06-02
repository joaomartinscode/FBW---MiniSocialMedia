import { useState, useEffect } from 'react';
import axios from 'axios';
import CommentItem from './CommentItem.jsx';
import { authHeaders } from '../lib/auth.js';

export default function CommentSection({ postId }) {
    const [commentsTree, setCommentsTree] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');

    const userFullName = localStorage.getItem('userFullName') || 'Me';

    useEffect(() => {
        const loadComments = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/comments/post/${postId}`,
                    authHeaders()
                );
                setCommentsTree(res.data);
            } catch (err) {
                console.error('Error loading comments:', err);
            }
        };

        if (postId) {
            loadComments();
        }
    }, [postId]);

    const handleAddMainComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        try {
            const res = await axios.post(
                'http://localhost:3000/api/comments',
                {
                    postId: Number(postId),
                    content: newCommentText
                },
                authHeaders()
            );

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
            console.error('Error posting comment:', err);
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
                        placeholder="Write a comment..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                    />
                </div>
            </form>

            <div className="d-flex flex-column gap-3">
                {commentsTree.length > 0 ? (
                    commentsTree.map(comment => (
                        <CommentItem
                            key={comment.CommentID}
                            comment={comment}
                            postId={postId}
                            refreshComments={() => {
                                const loadComments = async () => {
                                    try {
                                        const res = await axios.get(
                                            `http://localhost:3000/api/comments/post/${postId}`,
                                            authHeaders()
                                        );
                                        setCommentsTree(res.data);
                                    } catch (err) {
                                        console.error('Error loading comments:', err);
                                    }
                                };
                                loadComments();
                            }}
                        />
                    ))
                ) : (
                    <div className="ps-2 small text-muted">Be the first to comment!</div>
                )}
            </div>
        </div>
    );
}