import {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import Button from '../components/ui/Button.jsx';

function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                Email: email,
                Password: password
            });

            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token);
            }

            setSuccess(response.data.message || "Successful login");
            setEmail('');
            setPassword('');

            setTimeout(() => {
                navigate('/register');
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.message || 'Login error');
        }
    };

    return(
        <main className="container-fluid vh-100 p-0 overflow-hidden">
            <div className="row h-100 g-0">
                <section className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-5 bg-dark-panel" aria-hidden="true">
                    <h2 className="display-4 mb-5 text-center">
                        FACEBOOK DA WISH
                    </h2>
                    <figure className="w-100 text-center m-0" style={{ maxWidth: '480px' }}>
                        <img
                            src="/src/assets/images/IMG.svg"
                            alt="Decorative ilustration of users taking a photo"
                            className="img-fluid"
                            style={{ maxHeight: '420px' }}
                        />
                    </figure>
                </section>
                <section className="col-10 col-md-6 d-flex flex-column justify-content-center align-items-center position-relative bg-white px-4 mx-auto">
                    <article className="w-100" style={{ maxWidth: '400px' }}>
                        <header className="text-center mb-4">
                            <img
                                src="/src/assets/images/LOGO.svg"
                                alt="Logo Facebook da Wish"
                                className="mb-2 rounded-3"
                                style={{ width: '90px' }}
                            />
                            <h1 className="display-5">LOGIN</h1>
                        </header>

                        {success && <div className="alert alert-success" role="alert">{success}</div>}
                        {error  && <div className="alert alert-danger" role="alert">{error}</div>}

                        <form onSubmit={handleLogin}>


                            <div className="mb-3">
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                    <label htmlFor="emailInput" className="form-label fw-semibold text-secondary small m-0">Email</label>
                                </div>
                                <input
                                    id="emailInput"
                                    type="email"
                                    className={`form-control form-control-lg rounded-3 'border-secondary-subtle'}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="passwordInput" className="form-label fw-semibold text-secondary small">Password</label>
                                <input
                                    id="passwordInput"
                                    type="password"
                                    className="form-control form-control-lg rounded-3 border-secondary-subtle"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="d-grid gap-3 text-center mt-4">
                                <Button
                                    type="submit"
                                    variant="success"
                                    className="btn-lg text-white fw-bold px-5 py-2 rounded-3 shadow-sm"
                                >
                                    LOGIN
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="btn-lg fw-bold px-5 py-2 rounded-3 shadow-sm"
                                    onClick={() => window.location.href = '/register'}
                                >
                                    REGISTER
                                </Button>
                            </div>
                        </form>
                    </article>
                </section>
            </div>
        </main>
    )
}

export default LoginPage;