import { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import classnames from 'classnames/bind';

import { dataAPI } from '../../api.js';
import CardsDisplay from '../Layouts/CardsDisplay';
import Card from '../Layouts/Card';
import Recents from '../Home/Recents.js';

const cx = classnames.bind(styles);

const ProfilePage = () => {
    const [user, setUser] = useState({});

    // get user details on mount
    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const res = await dataAPI.get('/user/');
                const userData = res.data;
                // change resolution of profile img to 384px
                userData.imgUrl = userData.imgUrl.replace(/=s[0-9]+/, '=s384');
                setUser(userData);
            } catch (err) {
                console.error(err);
            }
        };
        getUserDetails();
    }, []);

    const handleLogOut = () => window.open('http://localhost:5000/auth/logout', '_self');

    return (
        <main>
            <CardsDisplay layout='single'>
                <Card hero img={{ src: user.imgUrl, alt: 'me' }}>
                    <div className={cx('text')}>
                        <span className={cx('name')}>{user.name}</span>
                        <span className={cx('email')}>{user.email}</span>
                    </div>
                    <button className={cx('button')} onClick={handleLogOut}>
                        Log Out
                    </button>
                </Card>
            </CardsDisplay>

            <Recents />

            {/* Catch all unknown routes and redirect to /profile */}
            <Route path='/profile/*'>
                <Redirect to='/profile' />
            </Route>
        </main>
    );
};

export default ProfilePage;
