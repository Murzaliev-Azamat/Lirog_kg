import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MainFilter from '../MainFilter/MainFilter';
import { Button } from '@mui/material';
import Menu from '../Menu/Menu';
import { NavLink } from 'react-router-dom';
import FormForFilter from '../FormForFilter/FormForFilter';
import { setCategory, setIsBirthday, setSubCategory } from '../../../store/filterSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { clearAllPromotions } from '../../../store/promotionsSlice';
import { clearAllCompanies } from '../../../store/companiesSlice';
import { selectSearch, setSearch } from '../../../store/searchSlice';
import AnonymousMenu from './AnonymousMenut';
import UserMenu from './UserMenu';
import { selectUser } from '../../../pages/users/usersSlise';

const Search = styled('div')(({ theme }) => ({
  flexGrow: 1,
  position: 'relative',
  display: 'none',
  backgroundColor: '#bdbdbd',
  borderRadius: theme.shape.borderRadius,
  marginRight: '10px',
  marginLeft: '20px',
  '&:hover': {
    backgroundColor: 'grey',
  },
  [theme.breakpoints.up('web')]: {
    display: 'block',
  },
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
const MenuIconButton = styled(IconButton)({
  marginLeft: '1px',
  color: 'orange',
  '&:hover': {
    color: 'grey',
  },
});
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: '100%',
  color: 'white',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));
const WebButtonFilter = styled(Button)(({ theme }) => ({
  color: 'orange',
  backgroundColor: 'white',
  borderColor: 'orange',
  '&:hover': {
    backgroundColor: 'white',
    borderColor: 'grey',
    color: 'grey',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
  [theme.breakpoints.up('web')]: {
    display: 'block',
  },
}));
const MobileButtonFilter = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up('web')]: {
    display: 'none',
  },
}));
const Link = styled(NavLink)(({ theme }) => ({
  color: 'orange',
  textDecoration: 'none',
  '&:hover': {
    color: 'grey',
  },
  [theme.breakpoints.down('sm')]: {
    marginRight: 'auto',
  },
}));

const AppToolBar = () => {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch);
  const user = useAppSelector(selectUser);
  const [showMainFilter, setShowMainFilter] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const cancelMainFilter = () => setShowMainFilter(false);

  const cancelMenu = () => setShowMenu(false);

  const getStartInfo = async () => {
    dispatch(setSearch(''));
    dispatch(setCategory(''));
    dispatch(setSubCategory(''));
    dispatch(setIsBirthday(false));
    dispatch(clearAllPromotions());
    dispatch(clearAllCompanies());
    setShowMenu(false);
  };

  const onTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setSearch(value));
  };

  const onKeyUpSearch = async () => {
    dispatch(setSearch(search));
    window.scrollTo(0, 0);
    await dispatch(clearAllPromotions());
    await dispatch(clearAllCompanies());
  };

  return (
    <Box>
      <MainFilter show={showMainFilter} title="Расширенный фильтр" onClose={cancelMainFilter}>
        <div className="modal-body">
          <FormForFilter closeFilter={cancelMainFilter} />
        </div>
      </MainFilter>
      <Menu show={showMenu} title="Меню" onClose={cancelMenu} getStartInfo={getStartInfo}></Menu>
      <AppBar sx={{ zIndex: 1, backgroundColor: 'white' }}>
        <Toolbar>
          <Link to={'/'} onClick={getStartInfo}>
            GOOD.KG
          </Link>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase onKeyUp={onKeyUpSearch} placeholder="Search…" onChange={onTextFieldChange} />
          </Search>
          <WebButtonFilter variant="outlined" onClick={() => setShowMainFilter(true)}>
            ФИЛЬТР
          </WebButtonFilter>
          {user ? <UserMenu user={user} /> : <AnonymousMenu />}
          <MobileButtonFilter onClick={() => setShowMainFilter(true)}>
            <svg className="icon-filter">
              <use xlinkHref="sprite.svg#filter"></use>
            </svg>
          </MobileButtonFilter>
          <MenuIconButton edge="start" aria-label="open drawer" onClick={() => setShowMenu(true)}>
            <MenuIcon sx={{ fontSize: 40 }} />
          </MenuIconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppToolBar;
