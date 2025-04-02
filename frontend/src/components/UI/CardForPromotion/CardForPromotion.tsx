import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import styled from 'styled-components';
import { apiUrl } from '../../../constants';
import { fetchPromotions, likePromotion } from '../../../store/promotionsThunks';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../containers/users/usersSlise';
import { Chip, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CustomAccordion = styled(Accordion)`
  --bs-accordion-active-bg: #e0e0e0ff;
  --bs-accordion-active-color: black;
  --bs-accordion-border-radius: 0px;
  --bs-accordion-inner-border-radius: 0px;
  --bs-accordion-btn-icon: none;
  --bs-accordion-btn-active-icon: none;
  --bs-accordion-btn-focus-box-shadow: none;
  //--bs-accordion-btn-padding-y: 10px;
  --bs-accordion-border-width: 0px;
  //--bs-accordion-btn-focus-border-color: red;
  //--bs-accordion-btn-icon: url();
  //margin-top: auto;
  //&:active {
  //  background-color: red;
  //}
  //background-color: green;
  --bs-accordion-bg: #e0e0e0ff;
  //--bs-accordion-btn-bg: #e0e0e0ff;
  --bs-accordion-btn-color: black;
  //--bs-accordion-active-color: black;
  //margin-top: 10px;
`;

const CustomAccordionHeader = styled(Accordion.Header)`
  //background-color: green;
  //--bs-accordion-bg: white;
  //--bs-accordion-btn-bg: #e0e0e0ff;
  //--bs-accordion-active-bg: red;
  //--bs-accordion-btn-color: white;
  //--bs-accordion-active-color: whitel;
  margin-top: 0;
`;

interface Props {
  id: string;
  title: string;
  description: string;
  company_name: string;
  company_image: string | null;
  promotion_image: string | null;
  rating: number;
  userLikes: string[];
  isAlways: boolean;
  isFresh: boolean;
  companyLink: string;
}

const CardForPromotion: React.FC<Props> = ({
  id,
  title,
  description,
  company_name,
  company_image,
  promotion_image,
  rating,
  userLikes,
  isAlways,
  isFresh,
  companyLink,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const [stateLiked, setStateLiked] = useState<boolean>(false);

  useEffect(() => {
    if (user && userLikes.includes(user._id)) {
      setStateLiked(true);
    }
  }, [dispatch, user, userLikes]);

  const toggleLike = async (id: string) => {
    if (user) {
      await dispatch(likePromotion(id));
      setStateLiked(!stateLiked);
    } else {
      navigate('/login');
    }
  };

  // let cardImage = '/mobile_banner.png';
  // 'https://media.istockphoto.com/id/1357365823/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=PM_optEhHBTZkuJQLlCjLz-v3zzxp-1mpNQZsdjrbns=';
  const infoImage = (
    <div
      style={{
        position: 'relative',
        minHeight: '200px',
        backgroundImage: 'url("/card_background.png")',
        backgroundSize: 'cover',
        borderTop: '7px solid white',
        borderLeft: '7px solid white',
        borderRight: '7px solid white',
        // textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <h5
        className="card-title text-center"
        dangerouslySetInnerHTML={{ __html: title }}
        style={{
          width: '85%',
          margin: 'auto',
          position: 'absolute',
          top: '48%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/*<img*/}
      {/*  src={cardImage}*/}
      {/*  className="card-img-top"*/}
      {/*  style={{*/}
      {/*    // position: 'absolute',*/}
      {/*    height: '200px',*/}
      {/*    top: 0,*/}
      {/*    left: 0,*/}
      {/*    right: 0,*/}
      {/*    bottom: 0,*/}
      {/*    objectFit: 'cover',*/}
      {/*    borderTop: '7px solid white',*/}
      {/*    borderLeft: '7px solid white',*/}
      {/*    borderRight: '7px solid white',*/}
      {/*  }}*/}
      {/*  alt="image"*/}
      {/*/>*/}
      <div
        style={{
          position: 'absolute',
          top: '83%',
          right: '3%',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ mb: 0 }}>
          {isFresh ? <Chip label={'New'} sx={{ backgroundColor: 'white', color: 'green' }} size="small" /> : null}
          {isAlways ? (
            <Chip label={'Постоянная акция'} sx={{ backgroundColor: 'white', color: 'black' }} size="small" />
          ) : (
            <Chip label={'Временная акция'} sx={{ backgroundColor: 'white', color: '#ed6c02' }} size="small" />
          )}
        </Stack>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', top: '83%', left: '3%' }}>
        {!stateLiked ? (
          <svg onClick={() => toggleLike(id)} className="icon" style={{ marginRight: '5px' }}>
            <use xlinkHref="sprite.svg#icon-heart-fill"></use>
          </svg>
        ) : (
          <svg onClick={() => toggleLike(id)} className="icon icon-red" style={{ marginRight: '5px' }}>
            <use xlinkHref="sprite.svg#icon-heart-fill"></use>
          </svg>
        )}
        {!stateLiked || (stateLiked && user && userLikes.includes(user._id)) ? (
          <span style={{ display: 'block', color: 'white', fontSize: '15px', lineHeight: '1' }}>{rating}</span>
        ) : (
          <span style={{ display: 'block', color: 'white', fontSize: '15px', lineHeight: '1' }}>{rating + 1}</span>
        )}
      </div>
    </div>
  );

  // if (promotion_image) {
  //   cardImage = apiUrl + '/' + promotion_image;
  //   infoImage = (
  //     <div style={{ position: 'relative', height: '200px' }}>
  //       <img
  //         src={cardImage}
  //         className="card-img-top"
  //         style={{
  //           // position: 'absolute',
  //           height: '200px',
  //           top: 0,
  //           left: 0,
  //           right: 0,
  //           bottom: 0,
  //           objectFit: 'cover',
  //           borderTop: '7px solid white',
  //           borderLeft: '7px solid white',
  //           borderRight: '7px solid white',
  //         }}
  //         alt="image"
  //       />
  //       <div
  //         style={{
  //           position: 'absolute',
  //           top: '84%',
  //           left: '5%',
  //         }}
  //       >
  //         <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
  //           {isFresh ? <Chip label={'New'} sx={{ backgroundColor: 'white', color: 'green' }} size="small" /> : null}
  //           {isAlways ? (
  //             <Chip label={'Постоянная акция'} sx={{ backgroundColor: 'white', color: 'black' }} size="small" />
  //           ) : (
  //             <Chip label={'Временная акция'} sx={{ backgroundColor: 'white', color: '#ed6c02' }} size="small" />
  //           )}
  //         </Stack>
  //       </div>
  //     </div>
  //   );
  // }

  // let infoRating = null;
  //
  // if (!stateLiked) {
  //   infoRating = <span style={{ display: 'block', color: 'grey', fontSize: '15px', lineHeight: '1' }}>{rating}</span>;
  // } else if (stateLiked && user && userLikes.includes(user._id)) {
  //   infoRating = (
  //     <span style={{ display: 'block', color: 'grey', fontSize: '15px', lineHeight: '1' }}>{rating - 1}</span>
  //   );
  // } else {
  //   infoRating = (
  //     <span style={{ display: 'block', color: 'grey', fontSize: '15px', lineHeight: '1' }}>{rating + 1}</span>
  //   );
  // }

  return (
    <>
      <div
        style={{
          width: '22rem',
          minHeight: '140px',
          boxShadow: '0px 0px 3px grey',
          borderRadius: '0px',
          backgroundColor: 'white',
          marginTop: '50px',
          marginBottom: '5px',
        }}
      >
        <div className="card-header" style={{ display: 'flex', position: 'relative' }}>
          <div style={{ borderRight: '1px solid #E0E0E0FF' }}>
            <a href={companyLink} target="_blank" rel="noreferrer">
              <img
                src={company_image ? apiUrl + '/' + company_image : '/mobile_banner.png'}
                alt="image"
                style={{
                  width: '112px',
                  height: '112px',
                  borderRadius: '0 0 0 0',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                }}
              />
            </a>
          </div>
          <div className="card-block-texts" style={{ flexGrow: 1 }}>
            <div
              style={{
                wordBreak: 'break-word',
                height: '112px',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                overflow: 'hidden',
              }}
            >
              <h2
                dangerouslySetInnerHTML={{ __html: title }}
                style={{
                  width: '100%',
                  fontFamily: 'Balsamiq Sans',
                  fontSize: '18px',
                  margin: '0',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              top: '-30%',
              left: '0%',
            }}
          >
            <Stack direction="row" spacing={0.5} sx={{ mb: 0, mr: 2 }}>
              {isFresh ? <Chip label={'New'} sx={{ backgroundColor: 'white', color: 'green' }} size="small" /> : null}
              {isAlways ? (
                <Chip label={'Постоянная акция'} sx={{ backgroundColor: 'white', color: 'black' }} size="small" />
              ) : (
                <Chip label={'Временная акция'} sx={{ backgroundColor: 'white', color: '#ed6c02' }} size="small" />
              )}
            </Stack>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              top: '-28%',
              right: '0%',
            }}
          >
            {!stateLiked ? (
              <svg onClick={() => toggleLike(id)} className="icon" style={{ marginRight: '5px' }}>
                <use xlinkHref="sprite.svg#icon-heart-fill"></use>
              </svg>
            ) : (
              <svg onClick={() => toggleLike(id)} className="icon icon-red" style={{ marginRight: '5px' }}>
                <use xlinkHref="sprite.svg#icon-heart-fill"></use>
              </svg>
            )}
            {!stateLiked || (stateLiked && user && userLikes.includes(user._id)) ? (
              <span style={{ display: 'block', color: 'white', fontSize: '15px', lineHeight: '1' }}>{rating}</span>
            ) : (
              <span style={{ display: 'block', color: 'white', fontSize: '15px', lineHeight: '1' }}>{rating + 1}</span>
            )}
          </div>
        </div>
        <div className="card-footer">
          <CustomAccordion>
            <Accordion.Item eventKey="0">
              <CustomAccordionHeader>ПОДРОБНЕЕ</CustomAccordionHeader>
              <Accordion.Body
                style={{ backgroundColor: 'white', wordBreak: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: description }}
              ></Accordion.Body>
            </Accordion.Item>
          </CustomAccordion>
        </div>
      </div>
      {/*<div*/}
      {/*  className="card col col-2 p-0 mb-2 me-1 ms-1 rounded-0"*/}
      {/*  style={{ width: '17.95rem', boxShadow: '1px 1px 4px grey', border: '0px' }}*/}
      {/*>*/}
      {/*  {infoImage}*/}
      {/*  <div className="card-body d-flex flex-column justify-content-between p-3">*/}
      {/*    /!*<Stack direction="row" spacing={1} sx={{ mb: 2 }}>*!/*/}
      {/*    /!*  {isFresh ? <Chip label={'New'} color="success" size="small" /> : null}*!/*/}
      {/*    /!*  {isAlways ? (*!/*/}
      {/*    /!*    <Chip label={'Постоянная акция'} sx={{ backgroundColor: 'grey', color: 'white' }} size="small" />*!/*/}
      {/*    /!*  ) : (*!/*/}
      {/*    /!*    <Chip label={'Временная акция'} color="warning" size="small" />*!/*/}
      {/*    /!*  )}*!/*/}
      {/*    /!*</Stack>*!/*/}

      {/*    /!*<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>*!/*/}
      {/*    /!*  <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px', marginLeft: '4px' }}>*!/*/}
      {/*    /!*    {!stateLiked ? (*!/*/}
      {/*    /!*      <svg onClick={() => toggleLike(id)} className="icon" style={{ marginRight: '5px' }}>*!/*/}
      {/*    /!*        <use xlinkHref="sprite.svg#icon-heart-fill"></use>*!/*/}
      {/*    /!*      </svg>*!/*/}
      {/*    /!*    ) : (*!/*/}
      {/*    /!*      <svg onClick={() => toggleLike(id)} className="icon icon-red" style={{ marginRight: '5px' }}>*!/*/}
      {/*    /!*        <use xlinkHref="sprite.svg#icon-heart-fill"></use>*!/*/}
      {/*    /!*      </svg>*!/*/}
      {/*    /!*    )}*!/*/}
      {/*    /!*    {!stateLiked || (stateLiked && user && userLikes.includes(user._id)) ? (*!/*/}
      {/*    /!*      <span style={{ display: 'block', color: 'grey', fontSize: '15px', lineHeight: '1' }}>{rating}</span>*!/*/}
      {/*    /!*    ) : (*!/*/}
      {/*    /!*      <span style={{ display: 'block', color: 'grey', fontSize: '15px', lineHeight: '1' }}>{rating + 1}</span>*!/*/}
      {/*    /!*    )}*!/*/}
      {/*    /!*  </div>*!/*/}
      {/*    /!*  <div style={{ display: 'flex' }}>*!/*/}
      {/*    /!*    <svg className="icon">*!/*/}
      {/*    /!*      <use xlinkHref="sprite.svg#icon-more"></use>*!/*/}
      {/*    /!*    </svg>*!/*/}
      {/*    /!*  </div>*!/*/}
      {/*    /!*</div>*!/*/}

      {/*    /!*<h5 className="card-title text-center" dangerouslySetInnerHTML={{ __html: title }} />*!/*/}
      {/*    /!*<p className="card-text">{description}</p>*!/*/}
      {/*    <div>*/}
      {/*      <a*/}
      {/*        href={companyLink}*/}
      {/*        className="btn mb-2 w-100 rounded-0"*/}
      {/*        target="_blank"*/}
      {/*        rel="noreferrer"*/}
      {/*        style={{ backgroundColor: '#ed6c02', color: 'white' }}*/}
      {/*      >*/}
      {/*        {company_name}*/}
      {/*      </a>*/}
      {/*      <CustomAccordion>*/}
      {/*        <Accordion.Item eventKey="0">*/}
      {/*          <CustomAccordionHeader>Подробнее</CustomAccordionHeader>*/}
      {/*          <Accordion.Body>{description}</Accordion.Body>*/}
      {/*        </Accordion.Item>*/}
      {/*      </CustomAccordion>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  );
};

export default CardForPromotion;
