import { useState } from 'react';
import PropTypes from 'prop-types';
import { register } from '../../services/api';

const RegisterForm = () => {
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(userData);
            alert('Registration successful! Please login.');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={userData.username}
                onChange={handleChange}
                className="border p-2 rounded"
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleChange}
                className="border p-2 rounded"
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleChange}
                className="border p-2 rounded"
                required
            />
            <button type="submit" className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
                Register
            </button>
        </form>
    );
};

RegisterForm.propTypes = {
    onRegister: PropTypes.func,
};

export default RegisterForm;
