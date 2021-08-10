import styles from './Hero.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const Hero = ({ img, maxHeight, children }) => (
    <section className={cx('hero', { '--max-height': maxHeight })}>
        <img src={img.src} alt={img.alt} />
        {children}
    </section>
);
export default Hero;
