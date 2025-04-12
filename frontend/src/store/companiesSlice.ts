import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { fetchCompanies, fetchCompaniesByCategory, fetchCompaniesBySearch, fetchCompanyById } from './companiesThunks';
import { Company } from '../types';
import { fetchPromotionById } from './promotionsThunks';

interface CompaniesState {
  companies: Company[] | [];
  company: Company | null;
  fetchAllLoading: boolean;
  addLoading: boolean;
  pageCompanies: number;
  pageCompaniesByCategory: number;
  pageCompaniesBySearch: number;
  hasMoreCompany: boolean;
}

const initialState: CompaniesState = {
  companies: [],
  company: null,
  fetchAllLoading: false,
  addLoading: false,
  pageCompanies: 1,
  pageCompaniesByCategory: 1,
  pageCompaniesBySearch: 1,
  hasMoreCompany: true,
};

export const CompaniesSlice = createSlice({
  name: 'companies',
  initialState: initialState,
  reducers: {
    clearAllCompanies: (state) => {
      state.companies = [];
      state.pageCompanies = 1;
      state.pageCompaniesByCategory = 1;
      state.pageCompaniesBySearch = 1;
      state.hasMoreCompany = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCompanies.pending, (state) => {
      state.fetchAllLoading = true;
    });
    builder.addCase(fetchCompanies.fulfilled, (state, action) => {
      state.fetchAllLoading = false;
      state.companies = [...state.companies, ...action.payload];
      //Array.prototype.push.apply(state.companies, action.payload);
      state.pageCompanies++;
      if (action.payload.length === 0) {
        state.hasMoreCompany = false;
      }
    });
    builder.addCase(fetchCompanies.rejected, (state) => {
      state.fetchAllLoading = false;
    });
    builder.addCase(fetchCompaniesByCategory.pending, (state) => {
      state.fetchAllLoading = true;
    });
    builder.addCase(fetchCompaniesByCategory.fulfilled, (state, action) => {
      state.fetchAllLoading = false;
      state.companies = [...state.companies, ...action.payload];
      //Array.prototype.push.apply(state.companies, action.payload);
      state.pageCompaniesByCategory++;
      if (action.payload.length === 0) {
        state.hasMoreCompany = false;
      }
    });
    builder.addCase(fetchCompaniesByCategory.rejected, (state) => {
      state.fetchAllLoading = false;
    });
    builder.addCase(fetchCompaniesBySearch.pending, (state) => {
      state.fetchAllLoading = true;
    });
    builder.addCase(fetchCompaniesBySearch.fulfilled, (state, action) => {
      state.fetchAllLoading = false;
      state.companies = [...state.companies, ...action.payload];
      //Array.prototype.push.apply(state.companies, action.payload);
      state.pageCompaniesBySearch++;
      if (action.payload.length === 0) {
        state.hasMoreCompany = false;
      }
    });
    builder.addCase(fetchCompaniesBySearch.rejected, (state) => {
      state.fetchAllLoading = false;
    });
    builder.addCase(fetchCompanyById.pending, (state) => {
      state.fetchAllLoading = true;
    });
    builder.addCase(fetchCompanyById.fulfilled, (state, action) => {
      state.fetchAllLoading = false;
      state.company = action.payload;
    });
    builder.addCase(fetchCompanyById.rejected, (state) => {
      state.fetchAllLoading = false;
    });
  },
});

export const companiesReducer = CompaniesSlice.reducer;
export const selectCompanies = (state: RootState) => state.companies.companies;
export const selectCompany = (state: RootState) => state.companies.company;
export const selectHasMoreCompany = (state: RootState) => state.companies.hasMoreCompany;

export const { clearAllCompanies } = CompaniesSlice.actions;

// export const selectHasMore = (state: RootState) => state.promotions.hasMore;
// export const selectFetchData = (state: RootState) => state.promotions.fetchData;

export const selectFetchAllLoading = (state: RootState) => state.companies.fetchAllLoading;
