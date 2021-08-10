import styles from './Card.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const Card = ({ img, reverse, children }) => (
    <article className={cx('card', { '--reverse': reverse })}>
        <img src={img.src} alt={img.alt} className={cx('img')} />
        <div className={cx('details')}>{children}</div>
    </article>
);

export default Card;
