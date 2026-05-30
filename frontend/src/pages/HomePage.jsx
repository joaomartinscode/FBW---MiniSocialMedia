import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import PostCard from '../components/PostCard.jsx';
import CreatePostModal from '../components/CreatePostModal.jsx';
import SidebarSuggestions from '../components/SidebarSuggestions.jsx';
import SidebarFriends from '../components/SidebarFriends.jsx';

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [sentRequests, setSentRequests] = useState([]); 
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loadingSuggestions, setLoadingSuggestions] = useState(true);

    const loggedInUserId = Number(localStorage.getItem('userId'));

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoadingSuggestions(true);
            
            try {
                const postsResponse = await axios.get('http://localhost:3000/api/posts', getAuthHeaders());
                console.log('Posts recebidos:', postsResponse.data);
                setPosts(Array.isArray(postsResponse.data) ? postsResponse.data : []);
            } catch (err) {
                console.error('Erro ao carregar posts:', err);
                setPosts([]);
            }

            
            try {
                const [suggestionsResponse, sentResponse] = await Promise.all([
                    axios.get('http://localhost:3000/api/users/suggestions', getAuthHeaders()),
                    axios.get(`http://localhost:3000/api/friends/${loggedInUserId}/sent`, getAuthHeaders())
                ]);

                setSuggestions(Array.isArray(suggestionsResponse.data) ? suggestionsResponse.data : []);
                setSentRequests(Array.isArray(sentResponse.data) ? sentResponse.data : []);
            } catch (err) {
                console.error('Erro ao carregar dados da sidebar:', err);
                setSuggestions([]);
                setSentRequests([]);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        if (loggedInUserId) {
            fetchHomeData();
        }
    }, [loggedInUserId]);

    const handlePostCreated = (newPost) => {
        if (!newPost || !newPost.PostID) return;

        setPosts((prev) => {
            const alreadyExists = prev.some((p) => Number(p.PostID) === Number(newPost.PostID));
            if (alreadyExists) return prev;
            return [newPost, ...prev];
        });
    };

    const handlePostDeleted = (deletedPostId) => {
        setPosts((prev) => prev.filter((p) => Number(p.PostID) !== Number(deletedPostId)));
    };

    const handlePostUpdated = (updatedPostId, newContent) => {
        setPosts((prev) =>
            prev.map((p) =>
                Number(p.PostID) === Number(updatedPostId)
                    ? { ...p, Content: newContent }
                    : p
            )
        );
    };

    const handleSendFriendRequest = async (friendId) => {
        try {
            await axios.post(
                `http://localhost:3000/api/friends/${loggedInUserId}/add/${friendId}`,
                {},
                getAuthHeaders()
            );

            
            setSentRequests((prev) => [...prev, { FriendID: friendId }]);

        } catch (err) {
            console.error('Erro ao enviar pedido de amizade:', err);
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            <Navbar onNewPostClick={() => setShowCreateModal(true)} />

            <div className="container py-4">
                <div className="row g-4">
                    {}
                    <div className="col-12 col-lg-3 d-none d-lg-block">
                        <div className="bg-white rounded-4 shadow-sm position-sticky" style={{ top: '80px' }}>
                            <SidebarFriends currentUserId={loggedInUserId} />
                        </div>
                    </div>

                    {}
                    <div className="col-12 col-lg-6">
                        <div className="mx-auto" style={{ maxWidth: '100%' }}>
                            {posts.length === 0 ? (
                                <div className="bg-white p-5 rounded-4 shadow-sm text-center">
                                    <p className="text-muted mb-0">Ainda não existem posts para mostrar.</p>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-4">
                                    {posts.map((post) => (
                                        <PostCard
                                            key={post.PostID}
                                            post={post}
                                            currentUserId={loggedInUserId}
                                            onPostDeleted={handlePostDeleted}
                                            onPostUpdated={handlePostUpdated}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {}
                    <div className="col-12 col-lg-3">
                        <div className="bg-white rounded-4 shadow-sm position-sticky" style={{ top: '80px' }}>
                            <SidebarSuggestions
                                suggestions={suggestions}
                                sentRequests={sentRequests}
                                onAddFriend={handleSendFriendRequest}
                                loading={loadingSuggestions}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <CreatePostModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onPostCreated={handlePostCreated}
            />
        </div>
    );
}