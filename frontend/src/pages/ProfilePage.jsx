import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import Navbar from '../components/Navbar.jsx';
import ProfileHeader from '../components/ProfileHeader.jsx';
import CreatePostModal from '../components/CreatePostModal.jsx';
import EditProfileModal from '../components/EditProfileModal.jsx';
import PostCard from '../components/PostCard.jsx';
import SidebarFriends from '../components/SidebarFriends.jsx';

export default function ProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [friendStatus, setFriendStatus] = useState('NONE');

    const loggedInUserId = Number(localStorage.getItem('userId'));
    const currentProfileId = Number(id || loggedInUserId);
    const isOwnProfile = Number(currentProfileId) === Number(loggedInUserId);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setUser(null);
                setPosts([]);
                setFriendStatus('NONE');

                if (!currentProfileId) {
                    console.log("[DEBUG] No currentProfileId, skipping fetch");
                    return;
                }

                console.log(`[DEBUG] Fetching profile data for ID: ${currentProfileId}, isOwnProfile: ${isOwnProfile}`);

                const fetchPromises = [
                    axios.get(`http://localhost:3000/api/users/${currentProfileId}`, getAuthHeaders()),
                    axios.get(`http://localhost:3000/api/posts/user/${currentProfileId}`, getAuthHeaders())
                ];

                if (!isOwnProfile) {
                    fetchPromises.push(
                        axios.get(`http://localhost:3000/api/friends/${loggedInUserId}/status/${currentProfileId}`, getAuthHeaders())
                    );
                }

                const results = await Promise.all(fetchPromises);
                console.log("[DEBUG] Fetch results:", results.map(r => r.status));

                setUser(results[0].data);
                setPosts(Array.isArray(results[1].data) ? results[1].data : []);

                if (!isOwnProfile && results[2]) {
                    setFriendStatus(results[2].data.status);
                }

            } catch (err) {
                console.error('Erro ao carregar perfil/posts:', err);
                setUser(null);
                setPosts([]);
                setFriendStatus('NONE');
            }
        };

        fetchProfileData();
    }, [currentProfileId, isOwnProfile, loggedInUserId]);

    const handleToggleFriend = async () => {
        try {
            if (friendStatus === 'ACCEPTED' || friendStatus === 'REQUESTED') {
                await axios.delete(`http://localhost:3000/api/friends/${loggedInUserId}/remove/${currentProfileId}`, getAuthHeaders());
                setFriendStatus('NONE');
            } else if (friendStatus === 'PENDING') {
                await axios.put(`http://localhost:3000/api/friends/${loggedInUserId}/accept/${currentProfileId}`, {}, getAuthHeaders());
                setFriendStatus('ACCEPTED');
            } else if (friendStatus === 'NONE') {
                await axios.post(`http://localhost:3000/api/friends/${loggedInUserId}/add/${currentProfileId}`, {}, getAuthHeaders());
                setFriendStatus('REQUESTED');
            }
        } catch (error) {
            console.error("Erro ao alterar estado de amizade:", error);
            alert("Não foi possível processar o pedido de amizade.");
        }
    };

    const handlePostCreated = (newPost) => {
        if (!newPost || !newPost.PostID) return;
        setPosts((prev) => [newPost, ...prev]);
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

    const handleProfileUpdated = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <div className="min-vh-100 bg-white">
            <Navbar onNewPostClick={() => setShowCreateModal(true)} />

            <ProfileHeader
                user={user}
                isOwnProfile={isOwnProfile}
                friendStatus={friendStatus}
                onEditProfile={() => setShowEditProfileModal(true)}
                onToggleFriend={handleToggleFriend}
            />

            <div className="container-fluid px-0">
                <div className="row g-0">
                    <div className="col-12 col-lg-9">
                        <div className="px-5 py-4">
                            {posts.length === 0 ? (
                                <p className="text-muted">Ainda não existem posts para mostrar.</p>
                            ) : (
                                posts.map((post) => (
                                    <PostCard
                                        key={post.PostID}
                                        post={post}
                                        currentUserId={loggedInUserId}
                                        onPostDeleted={handlePostDeleted}
                                        onPostUpdated={handlePostUpdated}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="col-12 col-lg-3">
                        <div className="p-4">
                            <SidebarFriends currentUserId={currentProfileId} />
                        </div>
                    </div>
                </div>
            </div>

            {isOwnProfile && (
                <>
                    <CreatePostModal
                        show={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onPostCreated={handlePostCreated}
                    />
                    <EditProfileModal
                        show={showEditProfileModal}
                        onClose={() => setShowEditProfileModal(false)}
                        user={user}
                        onProfileUpdated={handleProfileUpdated}
                    />
                </>
            )}
        </div>
    );
}