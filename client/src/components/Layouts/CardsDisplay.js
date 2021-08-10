import styles from './CardsDisplay.module.css';
import classnames from 'classnames/bind';

import Titlebar from '../Titlebar.js/Titlebar';

const cx = classnames.bind(styles);

const CardsDisplay = ({ icon, title, subtitle, layout, children }) => {
    let layoutModifier;
    switch (layout) {
        case 'grid':
        case 'column':
            layoutModifier = `--${layout}`;
            break;
        default:
            throw new Error(`Unknown layout prop: '${layout}' in CardsDisplay`);
    }

    return (
        <section className={cx('cards-display', layoutModifier)}>
            {(title || subtitle) && (
                <Titlebar subtitle={subtitle} icon={icon}>
                    {title}
                </Titlebar>
            )}
            <div className={cx('cards', layoutModifier)}>{children}</div>
        </section>
    );
};

export default CardsDisplay;
