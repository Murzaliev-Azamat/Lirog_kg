import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import axiosApi from '../axiosApi';
import { Company, CompanyApi, FilterByCategoryForCompany, Search } from '../types';

export const fetchCompanies = createAsyncThunk<Company[], void, { state: RootState }>(
  'companies/fetchAll',
  async (category, thunkAPI) => {
    const page = thunkAPI.getState().companies.pageCompanies;

    const companiesResponse = await axiosApi.get<Company[]>('/companies/?limit=' + 10 + '&page=' + page);
    return companiesResponse.data;
  },
);

export const fetchCompaniesByCategory = createAsyncThunk<
  Company[] | [],
  FilterByCategoryForCompany | undefined,
  { state: RootState }
>('companies/fetchAllByCategory', async (category, thunkAPI) => {
  const pageByCategory = thunkAPI.getState().companies.pageCompaniesByCategory;
  if (category) {
    const companiesResponse = await axiosApi.get<Company[]>(
      '/companies/category/?limit=' + 10 + '&categoryId=' + category.category + '&page=' + pageByCategory,
    );
    return companiesResponse.data;
  }
  return [];
});

export const fetchCompaniesBySearch = createAsyncThunk<Company[] | [], Search | undefined, { state: RootState }>(
  'companies/fetchCompaniesBySearch',
  async (search, thunkAPI) => {
    const pageBySearch = thunkAPI.getState().companies.pageCompaniesBySearch;

    if (search) {
      const companiesResponse = await axiosApi.get<Company[]>(
        '/companies/search/?limit=' + 10 + '&search=' + search.search + '&page=' + pageBySearch,
      );
      return companiesResponse.data;
    }
    return [];
  },
);

export const fetchCompanyById = createAsyncThunk<Company, string>('companies/fetchOne', async (id) => {
  const companyResponse = await axiosApi.get<Company | null>('companies/' + id);
  const company = companyResponse.data;

  if (company === null) {
    throw new Error('Not found!');
  }

  return company;
});

export const addCompany = createAsyncThunk<void, CompanyApi>('companies/addCompany', async (company) => {
  const formData = new FormData();

  formData.append('title', company.title);
  // formData.append('categories', company.categories);
  formData.append('categories', company.categories.join(','));
  formData.append('link', company.link);

  if (company.description) {
    formData.append('description', company.description);
  }

  if (company.image) {
    formData.append('image', company.image);
  }

  await axiosApi.post<CompanyApi>('/companies', formData);
});

export interface CompanyMutation {
  id: string;
  company: CompanyApi;
}

export const editCompany = createAsyncThunk<void, CompanyMutation>('companies/editCompany', async (params) => {
  const formData = new FormData();

  formData.append('title', params.company.title);
  // formData.append('categories', company.categories);
  formData.append('categories', params.company.categories.join(','));
  formData.append('link', params.company.link);

  if (params.company.description) {
    formData.append('description', params.company.description);
  }

  if (params.company.image) {
    formData.append('image', params.company.image);
  }

  await axiosApi.patch<CompanyApi>('/companies/' + params.id, formData);
});

export const deleteCompany = createAsyncThunk<void, string>('companies/deleteCompany', async (id) => {
  await axiosApi.delete('/companies/' + id);
});
