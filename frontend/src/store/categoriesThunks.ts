import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../axiosApi';
import { Category, CategoryApi } from '../types';

export const fetchCategories = createAsyncThunk<Category[]>('categories/fetchAll', async () => {
  const categoriesResponse = await axiosApi.get<Category[]>('/categories/?limit=' + 1000);
  return categoriesResponse.data;
});

export const addCategory = createAsyncThunk<void, CategoryApi>('categories/addCategory', async (category) => {
  await axiosApi.post<CategoryApi>('/categories', category);
});

export const deleteCategory = createAsyncThunk<void, string>('categories/deleteCategory', async (id) => {
  await axiosApi.delete('/categories/' + id);
});
