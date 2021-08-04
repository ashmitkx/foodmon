import { NavLink } from 'react-router-dom';
import styles from './SubNav.module.css';
import classnames from 'classnames/bind';

import { AiOutlineShop } from 'react-icons/ai';
import { BiStar, BiTimeFive, BiDish } from 'react-icons/bi';
import { RiMapPin2Line } from 'react-icons/ri';

const cx = classnames.bind(styles);

const NavList = ({ page }) => {
    switch (page) {
        case 'home':
            return (
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
                            <BiDish className={cx('--bidish')} />
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
            );
        case 'search':
            return (
                <ul>
                    <li>
                        <NavLink to='/search/restaurants' activeClassName={cx('--active')}>
                            <AiOutlineShop className={cx('--aishop')} />
                            Restaurants
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/search/dishes' activeClassName={cx('--active')}>
                            <BiDish className={cx('--bidish')} />
                            Dishes
                        </NavLink>
                    </li>
                </ul>
            );
        default:
            throw new Error('Invalid page prop for SubNav');
    }
};

const SubNav = ({ page }) => {
    return (
        <nav className={cx('subnav')}>
            <NavList page={page} />
        </nav>
    );
};

export default SubNav;
