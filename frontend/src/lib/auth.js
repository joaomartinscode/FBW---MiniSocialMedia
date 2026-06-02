export const authHeaders = () => {
    const token = localStorage.getItem('token');

    return token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
};

export const getStoredUserId = () => Number(localStorage.getItem('userId') || 0);


