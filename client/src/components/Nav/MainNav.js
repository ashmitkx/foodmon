import styles from './MainNav.module.css';
import classnames from 'classnames/bind';

import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { BiHomeAlt, BiSearch, BiFace } from 'react-icons/bi';
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
                            <BiFace />
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default MainNav;
