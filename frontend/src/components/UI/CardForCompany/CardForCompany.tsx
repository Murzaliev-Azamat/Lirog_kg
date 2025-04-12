import React from 'react';
import { apiUrl } from '../../../constants';
import { NavLink } from 'react-router-dom';
import './CardForCompany.css';

interface Props {
  id: string;
  title: string;
  link: string;
  image: string | null;
}

const CardForCompany: React.FC<Props> = ({ id, title, link, image }) => {
  return (
    <div
      className="card text-center col col-2 p-0 mb-2 me-1 ms-1"
      style={{ width: '17.95rem', boxShadow: '1px 1px 4px grey' }}
    >
      <img
        src={
          image
            ? apiUrl + '/' + image
            : 'https://media.istockphoto.com/id/1357365823/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=PM_optEhHBTZkuJQLlCjLz-v3zzxp-1mpNQZsdjrbns='
        }
        className="card-img-top img-company"
        alt="image"
      />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <NavLink
          to={'/company-page/' + id}
          className="btn"
          style={{ display: 'block', marginBottom: '5px', backgroundColor: '#ed6c02', color: 'white' }}
        >
          Подробнее
        </NavLink>
        <a
          href={link}
          target="_blank"
          className="btn"
          rel="noreferrer"
          style={{ display: 'block', backgroundColor: 'grey', color: 'white' }}
        >
          Сайт компании
        </a>
      </div>
    </div>
  );
};

export default CardForCompany;
