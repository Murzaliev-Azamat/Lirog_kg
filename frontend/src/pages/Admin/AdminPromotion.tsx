import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  clearAllPromotions,
  selectFetchAllLoading,
  selectHasMorePromotion,
  selectPromotions,
} from '../../store/promotionsSlice';
import { NavLink } from 'react-router-dom';
import { deletePromotion, fetchPromotionsByAdmin, fetchPromotionsBySearch } from '../../store/promotionsThunks';
import { apiUrl } from '../../constants';
import InfiniteScroll from 'react-infinite-scroller';
import { selectSearch } from '../../store/searchSlice';
import Accordion from 'react-bootstrap/Accordion';
import './AdminPromotion.css';

const AdminPromotion = () => {
  const dispatch = useAppDispatch();
  const promotions = useAppSelector(selectPromotions);
  const hasMorePromotion = useAppSelector(selectHasMorePromotion);
  const fetchAllLoading = useAppSelector(selectFetchAllLoading);
  const search = useAppSelector(selectSearch);

  const loadMore = async () => {
    if (fetchAllLoading) {
      return;
    } else if (search !== '') {
      await dispatch(fetchPromotionsBySearch({ search: search }));
    } else {
      await dispatch(fetchPromotionsByAdmin());
    }
  };

  const removePromotion = async (id: string) => {
    await dispatch(deletePromotion(id));
    await dispatch(clearAllPromotions());
    await dispatch(fetchPromotionsByAdmin());
  };

  return (
    <div>
      <h2>Promotion</h2>
      <NavLink to={'/add-promotion'} type="button" className="btn btn-primary btn-sm">
        Добавить акцию
      </NavLink>
      <div className="h4-block-promotion-admin">
        <h4>Название акции</h4>
        <h4>Компания</h4>
        <h4>Описание</h4>
        <h4>Картинки</h4>
      </div>
      <InfiniteScroll
        // pageStart={0}
        loadMore={loadMore}
        hasMore={hasMorePromotion}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
        // initialLoad={true}
        // useWindow={true}
      >
        {promotions.map((promotion) => {
          return (
            <div key={promotion._id} className="p-block-promotion-admin">
              <div>
                <p dangerouslySetInnerHTML={{ __html: promotion.title }} />
              </div>
              <div>
                <p>{promotion.company.title}</p>
              </div>
              <div>
                <div>
                  <Accordion>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Описание акции</Accordion.Header>
                      <Accordion.Body dangerouslySetInnerHTML={{ __html: promotion.description }}></Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
              <div>
                <img src={apiUrl + '/' + promotion.image} style={{ width: '100px' }} alt="image"></img>
              </div>
              <div>
                <NavLink
                  type="button"
                  className="btn btn-warning btn-sm"
                  to={'/edit-promotion/' + promotion._id}
                  style={{ marginRight: '10px' }}
                  color="info"
                >
                  Edit
                </NavLink>
                <button onClick={() => removePromotion(promotion._id)} className="btn btn-danger btn-sm">
                  delete
                </button>
              </div>
            </div>
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default AdminPromotion;
