import { NavLink } from 'react-router-dom';
import styles from './SubNav.module.css';
import classnames from 'classnames/bind';

import { BiStar, BiTimeFive, BiDish } from 'react-icons/bi';
import { RiMapPin2Line } from 'react-icons/ri';

const cx = classnames.bind(styles);

const SubNav = () => {
    return (
        <nav className={cx('subnav')}>
            <ul>
                <li>
                    <NavLink to='/home/toprated' activeClassName={cx('--active')}>
                        <BiStar />
                        Top Rated
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/home/nearby' activeClassName={cx('--active')}>
                        <RiMapPin2Line />
                        Nearby
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/home/cuisines' activeClassName={cx('--active')}>
                        <BiDish className={cx('--cuisine')} />
                        Cuisines
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/home/recent' activeClassName={cx('--active')}>
                        <BiTimeFive />
                        Recent
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default SubNav;
