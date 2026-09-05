import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showerr, setShowerr] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}`,
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const json = await response.json();
            console.log('login response', json);

            if (json.authtoken) {
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);
                setIsLoggedIn(true);
                navigate('/app');
            } else {
                setShowerr(json.error || 'Login failed. Please check your credentials.');
                setTimeout(() => {
                    setShowerr('');
                }, 5000);
            }
        } catch (e) {
            console.log('Error fetching details: ' + e.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-md-center">
                <div className="col-12 col-md-6">
                    <h2 className="mb-4">Login</h2>
                    {showerr && <div className="alert alert-danger">{showerr}</div>}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleLogin}>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;