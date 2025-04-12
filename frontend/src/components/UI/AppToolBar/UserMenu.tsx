import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { User } from '../../../types';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../pages/users/usersThunks';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <Button onClick={handleClick} sx={{ color: 'grey', marginLeft: '10px' }}>
        Привет, {user.displayName}
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem>Профиль</MenuItem>
        <MenuItem onClick={handleLogout}>Выход</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
