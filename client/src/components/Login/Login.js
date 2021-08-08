import styles from './Login.module.css';
import classnames from 'classnames/bind';

import { AiOutlineGoogle } from 'react-icons/ai';

const cx = classnames.bind(styles);

const Login = () => {
    const handleLogIn = () => window.open('http://localhost:5000/auth/google', '_self');

    return (
        <main className={cx('login')}>
            <button onClick={handleLogIn}>
                <AiOutlineGoogle />
                <span>Login with Google</span>
            </button>
        </main>
    );
};

export default Login;
