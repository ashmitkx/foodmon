import styles from './MainNav.module.css';
import classnames from 'classnames/bind';

import { useWindowDimensions } from '../../hooks/useWindowDimensions.js';
import { ReactComponent as Logo } from '../../images/logo.svg';
import { BiHomeAlt, BiSearch, BiFace } from 'react-icons/bi';
import { RiShoppingBag3Line } from 'react-icons/ri';
import { NavLink } from 'react-router-dom';

const cx = classnames.bind(styles);

const MainNav = () => {
    const { width } = useWindowDimensions();

    return (
        <nav className={cx('main-nav')}>
            <ul>
                {width > 540 && (
                    <li>
                        <div className={cx('logo')}>
                            <Logo />
                        </div>
                    </li>
                )}
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
                {width <= 1345 && (
                    <li>
                        <NavLink to='/cart' activeClassName={cx('--active')}>
                            <RiShoppingBag3Line />
                        </NavLink>
                    </li>
                )}
                <li>
                    <NavLink to='/profile' activeClassName={cx('--active')}>
                        <BiFace />
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default MainNav;
