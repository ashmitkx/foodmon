import styles from './SearchBar.module.css';
import classnames from 'classnames/bind';

import { BiSearch } from 'react-icons/bi';

const cx = classnames.bind(styles);

const SearchBar = () => {
    return (
        <div className={cx('search')}>
            <input type='text' name='search' placeholder='Find something to eat ...' />
            <BiSearch />
        </div>
    );
};

export default SearchBar;
