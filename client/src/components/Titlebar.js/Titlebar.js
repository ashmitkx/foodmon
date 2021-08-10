import styles from './Titlebar.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const Titlebar = ({ icon, subtitle, children: title }) => (
    <div className={cx('titlebar')}>
        <div className={cx('title')}>
            {icon && <span>{icon}</span>}
            <h1>{title}</h1>
        </div>
        <span className={cx('subtitle')}>{subtitle}</span>
    </div>
);

export default Titlebar;
