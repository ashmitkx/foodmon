import styles from './CardsDisplay.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const CardsDisplay = ({ title, children }) => {
    return (
        <section className={cx('cards-display')}>
            {title && <h1>{title}</h1>}
            <div className={cx('cards')}>{children}</div>
        </section>
    );
};

export default CardsDisplay;
