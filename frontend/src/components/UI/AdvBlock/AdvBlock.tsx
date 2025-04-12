import React from 'react';
import { styled } from '@mui/material/styles';

interface Props extends React.PropsWithChildren {
  urlImage: string;
}

const AdvBlock: React.FC<Props> = ({ urlImage, children }) => {
  // const MyBlock = styled('div')({
  //   height: '100%',
  //   backgroundImage: 'url(' + urlImage + ')',
  //   backgroundPosition: '50% 63px',
  //   backgroundSize: 'cover',
  //   backgroundAttachment: 'fixed',
  //   paddingTop: 230,
  // });
  const MyBlock = styled('div')({
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    paddingTop: 230,
    '&:before': {
      content: '""',
      position: 'fixed',
      display: 'block',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundSize: 'cover',
      backgroundPosition: '50% 63px',
      backgroundImage: `url(${urlImage})`,
      transform: 'translateZ(0)',
      willChange: 'transform',
      // zIndex: -1,
    },
  });

  return (
    <MyBlock>
      <div style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', position: 'relative' }}>{children}</div>
    </MyBlock>
  );
};

export default AdvBlock;
