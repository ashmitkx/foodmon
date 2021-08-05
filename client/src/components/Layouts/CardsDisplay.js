import styles from './CardsDisplay.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const CardsDisplay = ({ icon, title, subtitle, overflowing, children }) => {
    return (
        <section className={cx('cards-display', { '--overflowing': overflowing })}>
            {(title || subtitle) && (
                <div className={cx('titlebar')}>
                    <div className={cx('title')}>
                        {icon && <span>{icon}</span>}
                        <h1>{title}</h1>
                    </div>
                    <span className={cx('subtitle')}>{subtitle}</span>
                </div>
            )}
            <div className={cx('cards')}>{children}</div>
        </section>
    );
};

export default CardsDisplay;
