import React, { ReactElement, useEffect } from 'react';
import { Box } from '@mui/material';
import AppToolBar from './components/UI/AppToolBar/AppToolBar';
import Home from './pages/Home/Home';
import { Route, Routes } from 'react-router-dom';
import Companies from './pages/Companies/Companies';
import { useLocation } from 'react-router-dom';
import Admin from './pages/Admin/Admin';
import Register from './pages/users/Register';
import Login from './pages/users/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useAppSelector } from './app/hooks';
import { selectUser } from './pages/users/usersSlise';
import AdminCategory from './pages/Admin/AdminCategory';
import AdminCompany from './pages/Admin/AdminCompany';
import AdminPromotion from './pages/Admin/AdminPromotion';
import FormForCategory from './components/UI/FormForCategory/FormForCategory';
import FormForCompany from './components/UI/FormForCompany/FormForCompany';
import FormForPromotion from './components/UI/FormForPromotion/FormForPromotion';
import CompanyPage from './pages/CompanyPage/CompanyPage';
import Contacts from './pages/Contacts/Contacts';

function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const user = useAppSelector(selectUser);

  const withAdminProtection = (element: ReactElement) => (
    <ProtectedRoute isAllowed={user && user.role === 'admin'}>{element}</ProtectedRoute>
  );

  return (
    <div className="App">
      <Box>
        <AppToolBar />
        <Routes>
          <Route path="/admin" element={withAdminProtection(<Admin />)}>
            <Route path="admin-category" element={<AdminCategory />} />
            <Route path="admin-company" element={<AdminCompany />} />
            <Route path="admin-promotion" element={<AdminPromotion />} />
          </Route>
          <Route path="/add-category" element={withAdminProtection(<FormForCategory />)} />
          <Route path="/add-company" element={withAdminProtection(<FormForCompany />)} />
          <Route path="/edit-company/:id" element={withAdminProtection(<FormForCompany />)} />
          <Route path="/add-promotion" element={withAdminProtection(<FormForPromotion />)} />
          <Route path="/edit-promotion/:id" element={withAdminProtection(<FormForPromotion />)} />
          <Route path="/" element={<Home />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/company-page/:id" element={<CompanyPage />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<span>Такой страницы не существует</span>} />
        </Routes>
      </Box>
    </div>
  );
}

export default App;
