import { NavLink } from 'react-router-dom';
import styles from './SubNav.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const SubNav = ({ basePage, links }) => {
    let modifier;
    if (links.length <= 2) modifier = '--center-on-small-screens';

    return (
        <nav className={cx('subnav', modifier)}>
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
