import { useState } from 'react';
import PropTypes from 'prop-types';
import { login } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
    const { login: loginUser } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { token } = await login(credentials);
            loginUser(token);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                className="border p-2 rounded"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                className="border p-2 rounded"
                required
            />
            <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Login
            </button>
        </form>
    );
};

LoginForm.propTypes = {
    onLogin: PropTypes.func,
};

export default LoginForm;
