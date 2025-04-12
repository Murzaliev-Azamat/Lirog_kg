import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import styled from 'styled-components';
import { apiUrl } from '../../../constants';
import { likePromotion } from '../../../store/promotionsThunks';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../pages/users/usersSlise';
import { Chip, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './CardForPromotion.css';

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
const CustomAccordionBody = styled(Accordion.Body)({
  backgroundColor: 'white',
  wordBreak: 'break-word',
});
const Chip1 = styled(Chip)({
  backgroundColor: 'white',
  color: 'green',
});
const Chip2 = styled(Chip)({
  backgroundColor: 'white',
  color: 'black',
});
const Chip3 = styled(Chip)({
  backgroundColor: 'white',
  color: '#ed6c02',
});

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

  return (
    <>
      <div className="my-card">
        <div className="my-card-header">
          <div className="img-block">
            <a href={companyLink} target="_blank" rel="noreferrer">
              <img
                className="img-promotion"
                src={company_image ? apiUrl + '/' + company_image : '/mobile_banner.png'}
                alt="image"
              />
            </a>
          </div>
          <div className="card-block-texts">
            <p dangerouslySetInnerHTML={{ __html: title }} />
          </div>
          <div className="time-block">
            <Stack direction="row" spacing={0.5} sx={{ mb: 0, mr: 2 }}>
              {isFresh ? <Chip1 label={'New'} size="small" /> : null}
              {isAlways ? (
                <Chip2 label={'Постоянная акция'} size="small" />
              ) : (
                <Chip3 label={'Временная акция'} size="small" />
              )}
            </Stack>
          </div>
          <div className="like-block">
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
              <span className="rating-span">{rating}</span>
            ) : (
              <span className="rating-span">{rating + 1}</span>
            )}
          </div>
        </div>
        <div className="my-card-footer">
          <CustomAccordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>ПОДРОБНЕЕ</Accordion.Header>
              <CustomAccordionBody dangerouslySetInnerHTML={{ __html: description }}></CustomAccordionBody>
            </Accordion.Item>
          </CustomAccordion>
        </div>
      </div>
    </>
  );
};

export default CardForPromotion;
