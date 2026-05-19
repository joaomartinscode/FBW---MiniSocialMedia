import { useState } from 'react';
import axios from 'axios';
import Button from '../components/ui/Button.jsx';

function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 8 || password.length > 20) {
            setError('Password must be between 8 and 20 characters.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', {
                FullName: fullName,
                Email: email,
                Password: password,
                Birthdate: birthDate || null
            });

            setSuccess(response.data.message || "User registered successfully");
            setFullName('');
            setEmail('');
            setPassword('');
            setBirthDate('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error registering user');
        }
    };

    const isEmailError = error.toLowerCase().includes('email');

    return (
        <main className="container-fluid vh-100 p-0 overflow-hidden">
            <div className="row h-100 g-0">

                {/* Form Section */}
                <section className="col-10 col-md-6 d-flex flex-column justify-content-center align-items-center position-relative bg-white px-4 mx-auto">

                    <Button
                        icon="bi bi-arrow-left-circle-fill"
                        to="/login"
                        variant="icon-primary"
                        size="fs-1"
                        className="position-absolute start-0 top-0 m-4"
                    />

                    <article className="w-100" style={{ maxWidth: '400px' }}>
                        <header className="text-center mb-4">
                            <img
                                src="/src/assets/images/LOGO.svg"
                                alt="Wish Facebook Logo"
                                className="mb-2 rounded-3"
                                style={{ width: '90px' }}
                            />
                            <h1 className="display-5">REGISTER</h1>
                        </header>

                        {success && <div className="alert alert-success" role="alert">{success}</div>}
                        {error && !isEmailError && <div className="alert alert-danger" role="alert">{error}</div>}

                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label htmlFor="nameInput" className="form-label fw-semibold text-secondary small">Name</label>
                                <input
                                    id="nameInput"
                                    type="text"
                                    className="form-control form-control-lg rounded-3 border-secondary-subtle"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                    <label htmlFor="emailInput" className="form-label fw-semibold text-secondary small m-0">Email</label>
                                    {isEmailError && (
                                        <span className="text-danger small" id="emailError">This email is already registered</span>
                                    )}
                                </div>
                                <input
                                    id="emailInput"
                                    type="email"
                                    className={`form-control form-control-lg rounded-3 ${isEmailError ? 'is-invalid' : 'border-secondary-subtle'}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-describedby={isEmailError ? "emailError" : undefined}
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

                            <div className="mb-4">
                                <label htmlFor="birthDateInput" className="form-label fw-semibold text-secondary small">BirthDate</label>
                                <input
                                    id="birthDateInput"
                                    type="date"
                                    className="form-control form-control-lg rounded-3 border-secondary-subtle"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                />
                            </div>

                            <div className="text-center">
                                <Button
                                    type="submit"
                                    variant="success"
                                    className="btn-lg text-white fw-bold px-5 py-2 rounded-3 shadow-sm"
                                >
                                    Register
                                </Button>
                            </div>
                        </form>
                    </article>
                </section>

                {/* Side Panel */}
                <section className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-5 bg-dark-panel" aria-hidden="true">
                    <h2 className="display-4 mb-5 text-center">
                        FACEBOOK DA WISH
                    </h2>
                    <figure className="w-100 text-center m-0" style={{ maxWidth: '480px' }}>
                        <img
                            src="/src/assets/images/IMG2.svg"
                            alt="Decorative illustration of a user holding a phone"
                            className="img-fluid"
                            style={{ maxHeight: '420px' }}
                        />
                    </figure>
                </section>

            </div>
        </main>
    );
}

export default RegisterPage;