import { useEffect } from 'react';
import styles from './SearchBar.module.css';
import classnames from 'classnames/bind';

import { BiSearch } from 'react-icons/bi';

const cx = classnames.bind(styles);

const SearchBar = ({ onSearch, onSearchFocus, autoFocus }) => {
    return (
        <form className={cx('search')} onSubmit={onSearch} onFocus={onSearchFocus}>
            <input
                autoFocus={autoFocus}
                required
                type='text'
                name='search'
                placeholder='Find something to eat ...'
            />
            <BiSearch />
        </form>
    );
};

export default SearchBar;
