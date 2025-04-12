import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCategories } from '../../store/categoriesSlice';
import { NavLink } from 'react-router-dom';
import { deleteCategory, fetchCategories } from '../../store/categoriesThunks';
import './AdminCategory.css';

const AdminCategory = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  const removeCategory = async (id: string) => {
    await dispatch(deleteCategory(id));
    await dispatch(fetchCategories());
  };

  return (
    <div>
      <h2>Category</h2>
      <NavLink to={'/add-category'} type="button" className="btn btn-primary btn-sm">
        Добавить категорию
      </NavLink>
      <div className="h4-block-category-admin">
        <h4>Название категории</h4>
        <h4>Родительская категория</h4>
      </div>
      {categories &&
        categories.map((category) => {
          const parentTitle = category.parent ? category.parent.title : '-';
          return (
            <div key={category._id} className="p-block-category-admin">
              <div style={{ width: '200px' }}>
                <p>{category.title}</p>
              </div>
              <div style={{ width: '300px' }}>
                <p>{parentTitle}</p>
              </div>
              <button onClick={() => removeCategory(category._id)} className="btn btn-danger btn-sm">
                delete
              </button>
            </div>
          );
        })}
    </div>
  );
};

export default AdminCategory;
