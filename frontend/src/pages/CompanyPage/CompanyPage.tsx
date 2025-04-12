import React, { useEffect } from 'react';
import AdvBlock from '../../components/UI/AdvBlock/AdvBlock';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deletePromotion, fetchPromotionsByCompanyId } from '../../store/promotionsThunks';
import { useParams } from 'react-router-dom';
import { selectPromotions } from '../../store/promotionsSlice';
import { selectUser } from '../users/usersSlise';
import { useMediaQuery, useTheme } from '@mui/material';
import './CompanyPage.css';

const CompanyPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const promotions = useAppSelector(selectPromotions);
  const user = useAppSelector(selectUser);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (params.id) {
      dispatch(fetchPromotionsByCompanyId(params.id));
    }
  }, [dispatch, params.id]);

  const removePromotion = async (id: string) => {
    await dispatch(deletePromotion(id));
    if (params.id) {
      await dispatch(fetchPromotionsByCompanyId(params.id));
    }
  };

  const urlImage = isMobile
    ? '/mobile_banner.png'
    : 'https://www.ts.kg/olol1/e6365698226d52c6d440fdac8cfa724a57dfa748.jpg';

  return (
    <AdvBlock urlImage={urlImage}>
      <div className="about-company-block">
        {promotions.map((promotion) => (
          <div key={promotion._id}>
            <h2 dangerouslySetInnerHTML={{ __html: promotion.title }} />
            <p dangerouslySetInnerHTML={{ __html: promotion.description }} />
            {user && user.role === 'admin' && (
              <button onClick={() => removePromotion(promotion._id)} className="btn btn-danger btn-sm">
                delete
              </button>
            )}
          </div>
        ))}
      </div>
    </AdvBlock>
  );
};

export default CompanyPage;
