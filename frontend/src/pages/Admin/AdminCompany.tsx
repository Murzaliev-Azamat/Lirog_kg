import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearAllCompanies, selectCompanies, selectHasMoreCompany } from '../../store/companiesSlice';
import { NavLink } from 'react-router-dom';
import { deleteCompany, fetchCompanies, fetchCompaniesBySearch } from '../../store/companiesThunks';
import { apiUrl } from '../../constants';
import { selectFetchAllLoading } from '../../store/companiesSlice';
import InfiniteScroll from 'react-infinite-scroller';
import { selectSearch } from '../../store/searchSlice';
import './AdminCompany.css';

const AdminCompany = () => {
  const companies = useAppSelector(selectCompanies);
  const dispatch = useAppDispatch();
  const hasMorePromotion = useAppSelector(selectHasMoreCompany);
  const fetchAllLoading = useAppSelector(selectFetchAllLoading);
  const search = useAppSelector(selectSearch);

  const loadMore = async () => {
    if (fetchAllLoading) {
      return;
    } else if (search !== '') {
      await dispatch(fetchCompaniesBySearch({ search: search }));
    } else {
      await dispatch(fetchCompanies());
    }
  };

  const removeCompany = async (id: string) => {
    await dispatch(deleteCompany(id));
    await dispatch(clearAllCompanies());
    await dispatch(fetchCompanies());
  };

  return (
    <div>
      <h2>Company</h2>
      <NavLink to={'/add-company'} type="button" className="btn btn-primary btn-sm">
        Добавить компанию
      </NavLink>
      <div className="h4-block-company-admin">
        <h4>Название компании</h4>
        <h4>Описание</h4>
        <h4>Категории</h4>
        <h4>Акции</h4>
        <h4>Картинки</h4>
        <h4>Ссылка</h4>
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
        {companies.map((company) => {
          return (
            <div key={company._id} className="p-block-company-admin">
              <div>
                <p>{company.title}</p>
              </div>
              <div>
                <p>{company.description}</p>
              </div>
              <div>
                {company.categories.map((companyCategory) => {
                  return <p key={companyCategory._id}>{companyCategory.title}</p>;
                })}
              </div>
              <div>
                <NavLink to={'/company-page/' + company._id} className="btn btn-primary btn-sm">
                  Подробнее
                </NavLink>
              </div>
              <div>
                <img src={apiUrl + '/' + company.image} style={{ width: '100px' }} alt="image"></img>
              </div>
              <div>
                <a href={company.link}>На сайт</a>
              </div>
              <div>
                <NavLink
                  type="button"
                  className="btn btn-warning btn-sm"
                  to={'/edit-company/' + company._id}
                  style={{ marginRight: '10px' }}
                  color="info"
                >
                  Edit
                </NavLink>
                <button onClick={() => removeCompany(company._id)} className="btn btn-danger btn-sm">
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

export default AdminCompany;
