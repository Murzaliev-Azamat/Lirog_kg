import React, { useEffect } from 'react';
import { Button, FormControlLabel, Switch } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectCategories } from '../../../store/categoriesSlice';
import { fetchCategories } from '../../../store/categoriesThunks';
import { clearAllPromotions } from '../../../store/promotionsSlice';
import {
  selectFilterCategory,
  selectFilterIsBirthday,
  selectFilterSubCategory,
  setCategory,
  setIsBirthday,
  setSubCategory,
} from '../../../store/filterSlice';
import { clearAllCompanies } from '../../../store/companiesSlice';

interface Props {
  closeFilter: () => void;
}

const FormForFilter: React.FC<Props> = ({ closeFilter }) => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const filterCategory = useAppSelector(selectFilterCategory);
  const filterSubcategory = useAppSelector(selectFilterSubCategory);
  const isBirthday = useAppSelector(selectFilterIsBirthday);

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (window.location.href === 'https://good.kg/') {
      dispatch(clearAllPromotions());
      dispatch(setCategory(filterCategory));
      dispatch(setIsBirthday(isBirthday));
    } else if (window.location.href === 'https://good.kg/companies') {
      dispatch(clearAllCompanies());
      dispatch(setCategory(filterCategory));
    }
    closeFilter();
  };

  const switchBirthday = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setIsBirthday(e.target.checked));
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'category') {
      dispatch(setCategory(value));
      dispatch(setSubCategory(''));
    } else if (name === 'subcategory') {
      dispatch(setSubCategory(value));
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <form
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      autoComplete="off"
      onSubmit={submitFormHandler}
    >
      <select
        className="form-select form-select-lg mb-3"
        name="category"
        id="category"
        value={filterCategory}
        onChange={inputChangeHandler}
      >
        <option>Выберете категорию</option>
        {categories &&
          categories.map((category) => {
            if (!category.parent) {
              return (
                <option value={category._id} key={category._id}>
                  {category.title}
                </option>
              );
            }
          })}
      </select>

      <select
        className="form-select form-select-lg mb-3"
        name="subcategory"
        id="subcategory"
        value={filterSubcategory}
        onChange={inputChangeHandler}
      >
        <option>Выберете подкатегорию</option>
        {categories &&
          categories.map((category) => {
            if (filterCategory !== '' && category.parent && filterCategory === category.parent._id) {
              return (
                <option value={category._id} key={category._id}>
                  {category.title}
                </option>
              );
            }
          })}
      </select>

      <FormControlLabel
        control={<Switch onChange={switchBirthday} checked={isBirthday} />}
        label="Акции в День рождение!"
      />

      <Button
        style={{ marginTop: 'auto', paddingTop: '12px', paddingBottom: '12px' }}
        type="submit"
        color="primary"
        variant="contained"
      >
        Ok
      </Button>
    </form>
  );
};

export default FormForFilter;
