
import Button from './ui/Button.jsx';
import { DEFAULT_AVATAR } from '../lib/constants.js';

export default function ProfileHeader({ user, isOwnProfile, friendStatus, onEditProfile, onToggleFriend }) {

    const getButtonConfig = () => {
        if (isOwnProfile) {
            return {
                label: 'Edit Profile',
                icon: 'bi bi-pencil',
                variant: 'primary',
                className: 'rounded-pill px-4 text-white'
            };
        }

        switch (friendStatus) {
            case 'ACCEPTED':
                return {
                    label: 'Remove Friend',
                    icon: 'bi bi-person-x',
                    variant: 'outline',
                    className: 'rounded-pill px-4 border-secondary text-dark'
                };
            case 'REQUESTED':
                return {
                    label: 'Cancel Request',
                    icon: 'bi bi-person-dash',
                    variant: 'outline',
                    className: 'rounded-pill px-4 border-secondary text-dark'
                };
            case 'PENDING':
                return {
                    label: 'Accept Request',
                    icon: 'bi bi-person-check',
                    variant: 'primary',
                    className: 'rounded-pill px-4 text-white'
                };
            case 'NONE':
            default:
                return {
                    label: 'Send Friend Request',
                    icon: 'bi bi-person-plus',
                    variant: 'primary',
                    className: 'rounded-pill px-4 text-white'
                };
        }
    };

    const config = getButtonConfig();

    return (
        <header className="profile-header">
            <div className="profile-banner" />
            <div className="container-fluid px-4 px-md-5">
                <div className="row align-items-end" style={{ marginTop: '-75px', position: 'relative', zIndex: 10 }}>
                    <div className="col-auto">
                        <img 
                            src={DEFAULT_AVATAR} 
                            alt="Avatar" 
                            className="profile-avatar rounded-circle shadow-sm" 
                            style={{ width: '150px', height: '150px', objectFit: 'cover', border: '5px solid white' }}
                        />
                    </div>
                    <div className="col pb-3">
                        <h1 className="profile-title mb-0">
                            {user?.FullName || 'User'}
                        </h1>
                    </div>
                    <div className="col-auto pb-3">
                        <Button
                            variant={config.variant}
                            icon={config.icon}
                            className={config.className}
                            onClick={isOwnProfile ? onEditProfile : onToggleFriend}
                        >
                            {config.label}
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}