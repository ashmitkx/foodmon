import styles from './Login.module.css';
import classnames from 'classnames/bind';

import { AiOutlineGoogle } from 'react-icons/ai';
import Hero from '../Layouts/Hero';
import Card from '../Layouts/Card';

const cx = classnames.bind(styles);

const Login = () => {
    const handleLogIn = () => window.open('http://localhost:5000/auth/google', '_self');

    return (
        <main className={cx('login')}>
            <Hero maxHeight img={{ src: '/assets/logo.svg', alt: 'logo' }}>
                <h1 className={cx('title')}>Foodmon</h1>
                <button className={cx('button')} onClick={handleLogIn}>
                    <AiOutlineGoogle />
                    <span>Log In with Google</span>
                </button>
                <span className={cx('made-by')}>
                    Made with <span>❤</span> by
                </span>
                <Card
                    img={{
                        src: 'https://avatars.githubusercontent.com/u/66110457?v=4',
                        alt: 'author'
                    }}
                >
                    <a
                        href='https://github.com/ashmitkx'
                        target='_blank'
                        rel='noreferrer'
                        className={cx('author')}
                    >
                        <span className={cx('name')}>Ashmit Khandelwal</span>
                        <span className={cx('tag')}>@ashmitkx</span>
                    </a>
                    <a
                        className={cx('repo')}
                        target='_blank'
                        rel='noreferrer'
                        href='https://github.com/ashmitkx/foodmon'
                    >
                        Github Repo
                    </a>
                </Card>
            </Hero>
        </main>
    );
};

export default Login;
