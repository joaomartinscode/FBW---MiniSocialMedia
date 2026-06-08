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
import Footer from '../components/Footer.jsx';
import { authHeaders, getStoredUserId } from '../lib/auth.js';

export default function ProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [friendStatus, setFriendStatus] = useState('NONE');

    const loggedInUserId = getStoredUserId();
    const currentProfileId = Number(id || loggedInUserId);
    const isOwnProfile = Number(currentProfileId) === Number(loggedInUserId);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setUser(null);
                setPosts([]);
                setFriendStatus('NONE');

                if (!currentProfileId) {
                    console.log('[DEBUG] No currentProfileId, skipping fetch');
                    return;
                }

                console.log(`[DEBUG] Fetching profile data for ID: ${currentProfileId}, isOwnProfile: ${isOwnProfile}`);

                const userResponse = await axios.get(`http://localhost:3000/api/users/${currentProfileId}`, authHeaders());
                setUser(userResponse.data);

                try {
                    const postsResponse = await axios.get(`http://localhost:3000/api/posts/user/${currentProfileId}`, authHeaders());
                    setPosts(Array.isArray(postsResponse.data) ? postsResponse.data : []);
                } catch (postsError) {
                    if (postsError?.response?.status === 404) {
                        setPosts([]);
                    } else {
                        console.error('Error loading profile posts:', postsError);
                        setPosts([]);
                    }
                }

                if (!isOwnProfile) {
                    try {
                        const friendResponse = await axios.get(
                            `http://localhost:3000/api/friends/${loggedInUserId}/status/${currentProfileId}`,
                            authHeaders()
                        );
                        setFriendStatus(friendResponse.data.status);
                    } catch (friendError) {
                        console.error('Error loading friend status:', friendError);
                        setFriendStatus('NONE');
                    }
                }

            } catch (err) {
                console.error('Error loading profile/posts:', err);
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
                await axios.delete(`http://localhost:3000/api/friends/${loggedInUserId}/remove/${currentProfileId}`, authHeaders());
                setFriendStatus('NONE');
            } else if (friendStatus === 'PENDING') {
                await axios.put(`http://localhost:3000/api/friends/${loggedInUserId}/accept/${currentProfileId}`, {}, authHeaders());
                setFriendStatus('ACCEPTED');
            } else if (friendStatus === 'NONE') {
                await axios.post(`http://localhost:3000/api/friends/${loggedInUserId}/add/${currentProfileId}`, {}, authHeaders());
                setFriendStatus('REQUESTED');
            }
        } catch (error) {
            console.error('Error updating friendship status:', error);
            alert('Could not process the friend request.');
        }
    };

    const handlePostCreated = (newPost) => {
        if (!newPost || !newPost.PostID) return;
        if (isOwnProfile) {
            setPosts((prev) => [newPost, ...prev]);
        }
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
        <div className="d-flex flex-column min-vh-100 bg-white">
            <Navbar onNewPostClick={() => setShowCreateModal(true)} />

            <main className="flex-grow-1">
                <ProfileHeader
                    user={user}
                    isOwnProfile={isOwnProfile}
                    friendStatus={friendStatus}
                    onEditProfile={() => setShowEditProfileModal(true)}
                    onToggleFriend={handleToggleFriend}
                />

                <div className="container-fluid px-0">
                    {user?.isPrivateAndNotFriend ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                            <h4 className="text-muted">This profile is private</h4>
                        </div>
                    ) : (
                        <div className="row g-0">
                            <div className="col-12 col-lg-9">
                                <div className="px-5 py-4">
                                    {posts.length === 0 ? (
                                        <p className="text-muted text-center mt-5">No posts to show yet.</p>
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
                    )}
                </div>
            </main>

            <CreatePostModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onPostCreated={handlePostCreated}
            />

            {isOwnProfile && showEditProfileModal && (
                <EditProfileModal
                    show={showEditProfileModal}
                    onClose={() => setShowEditProfileModal(false)}
                    user={user}
                    onProfileUpdated={handleProfileUpdated}
                />
            )}
            <Footer />
        </div>
    );
}