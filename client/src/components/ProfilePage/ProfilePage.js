import { Route, Redirect } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import classnames from 'classnames/bind';

import Recents from '../Home/Recents.js';

const cx = classnames.bind(styles);

const Profile = ({ user }) => (
    <article className={cx('profile')}>
        <img src={user.imgUrl} alt='me' />
        <div className={cx('text')}>
            <span className={cx('name')}>{user.name}</span>
            <span className={cx('email')}>{user.email}</span>
        </div>
        <button>Log Out</button>
    </article>
);

const ProfilePage = ({ user }) => {
    user = {
        name: 'Ashmit Khandelwal',
        email: 'ashmitk0507@gmail.com',
        imgUrl: 'https://lh3.googleusercontent.com/a-/AOh14Ggr_NSxpTqNuk3_NLO_hjGR3GN8Lh3BdnNDUVrDF70=s384-c'
    };

    return (
        <main>
            <Profile user={user} />
            <Recents />

            {/* Catch all unknown routes and redirect to /profile */}
            <Route path='/profile/*'>
                <Redirect to='/profile' />
            </Route>
        </main>
    );
};

export default ProfilePage;
