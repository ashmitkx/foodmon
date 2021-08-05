import { NavLink } from 'react-router-dom';
import styles from './SubNav.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const SubNav = ({ basePage, links }) => {
    return (
        <nav className={cx('subnav')}>
            <ul>
                {links.map(link => (
                    <li key={link.subPage}>
                        <NavLink to={basePage + link.subPage} activeClassName={cx('--active')}>
                            {link.icon}
                            {link.text}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SubNav;
