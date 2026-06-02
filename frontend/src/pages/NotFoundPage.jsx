import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <main className="d-flex flex-column justify-content-center align-items-center flex-grow-1 text-center px-3">
                <h1 className="display-1 fw-bold" style={{ color: '#313158' }}>404</h1>
                <p className="fs-3 fw-semibold">
                    <span className="text-danger">Oops!</span> Page not found.
                </p>
                <p className="lead text-muted">
                    The page you’re looking for doesn’t exist or has been moved.
                </p>
                <Link to="/" className="btn btn-primary btn-lg mt-4 rounded-pill px-4" style={{ backgroundColor: '#313158', borderColor: '#313158' }}>
                    Go Home
                </Link>
            </main>
        </div>
    );
};

export default NotFoundPage;