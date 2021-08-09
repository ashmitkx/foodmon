import styles from './CardsDisplay.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const CardsDisplay = ({ icon, title, subtitle, layout, children }) => {
    let layoutModifier;
    switch (layout) {
        case 'grid':
        case 'column':
        case 'single':
            layoutModifier = `--${layout}`;
            break;
        case 'none':
            break;
        default:
            throw new Error(`Unknown layout prop: '${layout}' in CardsDisplay`);
    }

    return (
        <section className={cx('cards-display', layoutModifier)}>
            {(title || subtitle) && (
                <div className={cx('titlebar')}>
                    <div className={cx('title')}>
                        {icon && <span>{icon}</span>}
                        <h1>{title}</h1>
                    </div>
                    <span className={cx('subtitle')}>{subtitle}</span>
                </div>
            )}
            <div className={cx('cards', layoutModifier)}>{children}</div>
        </section>
    );
};

export default CardsDisplay;
