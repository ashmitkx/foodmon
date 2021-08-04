import styles from './CardsDisplay.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const CardsDisplay = ({ title, subtitle, children }) => {
    return (
        <section className={cx('cards-display')}>
            {(title || subtitle) && (
                <div className={cx('titlebar')}>
                    <h1>{title}</h1>
                    <span>{subtitle}</span>
                </div>
            )}
            <div className={cx('cards')}>{children}</div>
        </section>
    );
};

export default CardsDisplay;
