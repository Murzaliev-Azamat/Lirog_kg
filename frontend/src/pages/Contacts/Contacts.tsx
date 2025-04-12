import React from 'react';
import AdvBlock from '../../components/UI/AdvBlock/AdvBlock';
import { useMediaQuery, useTheme } from '@mui/material';
import './Contacts.css';

const Contacts = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const urlImage = isMobile
    ? '/mobile_banner.png'
    : 'https://www.ts.kg/olol1/eff4e81a43c9b9d4c206faa5533a8ccea9443597.jpg';

  return (
    <AdvBlock urlImage={urlImage}>
      <div className="contacts-block">
        <h1>Контакты</h1>
        <p>Tel: +996556720128 (WhatsApp)</p>
        <p>Email: lirog.kg@gmail.com</p>
        <p>Кыргызстан г. Бишкек</p>
      </div>
    </AdvBlock>
  );
};

export default Contacts;
