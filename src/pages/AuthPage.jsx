import { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
                <div className="flex justify-around mb-4">
                    <button
                        className={`px-4 py-2 font-semibold ${isLogin ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
                            }`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`px-4 py-2 font-semibold ${!isLogin ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
                            }`}
                        onClick={() => setIsLogin(false)}
                    >
                        Register
                    </button>
                </div>
                {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    );
};

export default AuthPage;
