import React from 'react';
import Promotions from '../Promotions/Promotions';
import AdvBlock from '../../components/UI/AdvBlock/AdvBlock';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlise';
import { useMediaQuery, useTheme } from '@mui/material';

const Home = () => {
  const user = useAppSelector(selectUser);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const urlImage = isMobile
    ? '/mobile_banner_2.png'
    : 'https://www.ts.kg/olol1/2a25d56d3a6dc096b1a4fd06b392bc4db70149f2.jpg';

  return (
    <AdvBlock urlImage={urlImage}>
      {user && user.role === 'admin' && (
        <NavLink to={'/admin'} type="button" className="btn btn-primary btn-sm">
          Админка
        </NavLink>
      )}
      <Promotions />
    </AdvBlock>
  );
};

export default Home;
