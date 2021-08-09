import styles from './Card.module.css';
import classnames from 'classnames/bind';

const cx = classnames.bind(styles);

const DefaultCard = ({ img, reverse, children }) => (
    <article className={cx('default', { '--reverse': reverse })}>
        <img src={img.src} alt={img.alt} className={cx('img')} />
        <div className={cx('details')}>{children}</div>
    </article>
);

const HeroCard = ({ img, children }) => (
    <article className={cx('hero')}>
        <img src={img.src} alt={img.alt} className={cx('img')} />
        {children}
    </article>
);

const Card = ({ img, hero, reverse, children }) => {
    if (hero) return <HeroCard img={img}>{children}</HeroCard>;
    return (
        <DefaultCard img={img} reverse={reverse}>
            {children}
        </DefaultCard>
    );
};

export default Card;
