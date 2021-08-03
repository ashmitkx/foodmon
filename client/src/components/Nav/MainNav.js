import styles from './MainNav.module.css';
import classnames from 'classnames/bind';

import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { BiHomeAlt, BiSearch } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';

const cx = classnames.bind(styles);

const MainNav = () => {
    return (
        <div className={cx('main-nav')}>
            <div className={cx('logo')}>
                <HiOutlineMenuAlt2 />
            </div>
            <nav>
                <ul>
                    <li>
                        <NavLink to='/home' activeClassName={cx('--active')}>
                            <BiHomeAlt />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/search' activeClassName={cx('--active')}>
                            <BiSearch />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/profile' activeClassName={cx('--active')}>
                            <img
                                src='https://lh3.googleusercontent.com/ogw/ADea4I5xRiiAz0gaPmMo9n-tNrRHYYUeI-BdSD3cRVOLXnA=s83-c-mo'
                                alt='me'
                            />
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default MainNav;
