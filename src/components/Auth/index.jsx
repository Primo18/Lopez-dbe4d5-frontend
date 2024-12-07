import PropTypes from 'prop-types';
import '../../pages/AuthPage.css';

const AuthTabs = ({ isRegister, setIsRegister }) => (
    <div className="auth-tabs">
        <button
            onClick={() => setIsRegister(false)}
            className={!isRegister ? 'active' : ''}
        >
            Login
        </button>
        <button
            onClick={() => setIsRegister(true)}
            className={isRegister ? 'active' : ''}
        >
            Register
        </button>
    </div>
);

AuthTabs.propTypes = {
    isRegister: PropTypes.bool.isRequired,
    setIsRegister: PropTypes.func.isRequired,
};

export default AuthTabs;
