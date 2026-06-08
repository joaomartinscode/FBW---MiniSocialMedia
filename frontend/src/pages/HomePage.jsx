import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import PostCard from '../components/PostCard.jsx';
import CreatePostModal from '../components/CreatePostModal.jsx';
import SidebarSuggestions from '../components/SidebarSuggestions.jsx';
import SidebarFriends from '../components/SidebarFriends.jsx';
import Footer from '../components/Footer.jsx';
import { authHeaders, getStoredUserId } from '../lib/auth.js';

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [suggestions, setSuggestions] = useState(null);
    const [sentRequests, setSentRequests] = useState(null); 
    const [showCreateModal, setShowCreateModal] = useState(false);

    const loggedInUserId = getStoredUserId();

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const postsResponse = await axios.get('http://localhost:3000/api/posts', authHeaders());
                console.log('Posts recebidos:', postsResponse.data);
                setPosts(Array.isArray(postsResponse.data) ? postsResponse.data : []);
            } catch (err) {
                console.error('Erro ao carregar posts:', err);
                setPosts([]);
            }

            
            try {
                const [suggestionsResponse, sentResponse] = await Promise.all([
                    axios.get('http://localhost:3000/api/users/suggestions', authHeaders()),
                    axios.get(`http://localhost:3000/api/friends/${loggedInUserId}/sent`, authHeaders())
                ]);

                setSuggestions(Array.isArray(suggestionsResponse.data) ? suggestionsResponse.data : []);
                setSentRequests(Array.isArray(sentResponse.data) ? sentResponse.data : []);
            } catch (err) {
                console.error('Erro ao carregar dados da sidebar:', err);
                setSuggestions([]);
                setSentRequests([]);
            }
        };

        if (loggedInUserId) {
            fetchHomeData();
        }
    }, [loggedInUserId]);

    const handlePostCreated = (newPost) => {
        if (!newPost || !newPost.PostID) return;

        setPosts((prev) => {
            const alreadyExists = prev.some( (p) => Number(p.PostID) === Number(newPost.PostID));
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
                authHeaders()
            );

            
            setSentRequests((prev) => [...prev, { FriendID: friendId }]);

        } catch (err) {
            console.error('Error sending friend request:', err);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar onNewPostClick={() => setShowCreateModal(true)} />

            <main className="flex-grow-1 container py-4">
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
                                    <p className="text-muted mb-0">No posts to show yet.</p>
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
                            />
                        </div>
                    </div>
                </div>
            </main>

            <CreatePostModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onPostCreated={handlePostCreated}
            />
            <Footer />
        </div>
    );
}