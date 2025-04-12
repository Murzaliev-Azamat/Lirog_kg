import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Category } from '../types';
import { fetchCategories } from './categoriesThunks';

interface CategoriesState {
  categories: Category[] | [];
  // company: Company | null;
  fetchAllLoading: boolean;
  addCategoryLoading: boolean;
  // pageCompanies: number;
  // hasMoreCompany: boolean;
}

const initialState: CategoriesState = {
  categories: [],
  // company: null,
  fetchAllLoading: false,
  addCategoryLoading: false,
  // pageCompanies: 1,
  // hasMoreCompany: true,
};

export const CategoriesSlice = createSlice({
  name: 'categories',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.fetchAllLoading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.fetchAllLoading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state) => {
      state.fetchAllLoading = false;
    });
    // builder.addCase(fetchCompany.pending, (state) => {
    //   state.fetchAllLoading = true;
    // });
    // builder.addCase(fetchCompany.fulfilled, (state, action) => {
    //   state.fetchAllLoading = false;
    //   state.company = action.payload;
    // });
    // builder.addCase(fetchCompany.rejected, (state) => {
    //   state.fetchAllLoading = false;
    // });
    // builder.addCase(addCategory.pending, (state) => {
    //   state.addCategoryLoading = true;
    // });
    // builder.addCase(addCategory.fulfilled, (state) => {
    //   state.addCategoryLoading = false;
    // });
    // builder.addCase(addCategory.rejected, (state) => {
    //   state.addCategoryLoading = false;
    // });
  },
});

export const categoriesReducer = CategoriesSlice.reducer;
export const selectCategories = (state: RootState) => state.categories.categories;
// export const selectCompany = (state: RootState) => state.companies.company;
// export const selectHasMoreCompany = (state: RootState) => state.companies.hasMoreCompany;

// export const selectHasMore = (state: RootState) => state.promotions.hasMore;
// export const selectFetchData = (state: RootState) => state.promotions.fetchData;

export const selectFetchAllLoading = (state: RootState) => state.categories.fetchAllLoading;
export const selectAddCategoryLoading = (state: RootState) => state.categories.addCategoryLoading;
