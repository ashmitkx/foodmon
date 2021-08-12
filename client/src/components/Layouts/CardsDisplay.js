import styles from './CardsDisplay.module.css';
import classnames from 'classnames/bind';

import Titlebar from '../Titlebar.js/Titlebar';

const cx = classnames.bind(styles);

const CardsDisplay = ({ icon, title, subtitle, overflowing, children }) => (
    <section className={cx('cards-display', { '--overflowing': overflowing })}>
        {(title || subtitle) && (
            <Titlebar subtitle={subtitle} icon={icon}>
                {title}
            </Titlebar>
        )}
        <div className={cx('cards')}>{children}</div>
    </section>
);

export default CardsDisplay;
