import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="container-lg border" style={{ marginTop: '80px' }}>
      <div className="row">
        <div className="col-2 border">
          <div>
            <NavLink to={'admin-category'}>Категории</NavLink>
          </div>
          <div>
            <NavLink to={'admin-company'}>Компании</NavLink>
          </div>
          <div>
            <NavLink to={'admin-promotion'}>Акции</NavLink>
          </div>
        </div>
        <div className="col-10 border">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
