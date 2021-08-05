import { Route, Redirect } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import classnames from 'classnames/bind';

import CardsDisplay from '../Layouts/CardsDisplay.js';
import Card from '../Layouts/Card.js';
import Recents from '../Home/Recents.js';

const cx = classnames.bind(styles);

const ProfileCard = ({ imgUrl, name, email }) => (
    <Card img={{ src: imgUrl, alt: 'me' }}>
        <div className={cx('text')}>
            <h1>{name}</h1>
            <span>{email}</span>
        </div>
        <button className={cx('button')}>Log Out</button>
    </Card>
);

const ProfilePage = ({ user }) => {
    user = {
        name: 'Ashmit Khandelwal',
        email: 'ashmitk0507@gmail.com',
        imgUrl: 'https://lh3.googleusercontent.com/ogw/ADea4I5xRiiAz0gaPmMo9n-tNrRHYYUeI-BdSD3cRVOLXnA=s83-c-mo'
    };

    return (
        <main>
            <CardsDisplay>
                <ProfileCard {...user} />
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
