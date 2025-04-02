import { createAsyncThunk } from '@reduxjs/toolkit';
import { FilterByCategoryForPromotion, Promotion, PromotionApi, Search } from '../../types';
import axiosApi from '../axiosApi';
import { RootState } from '../app/store';

export const fetchPromotions = createAsyncThunk<Promotion[], void, { state: RootState }>(
  'promotions/fetchAll',
  async (category, thunkAPI) => {
    const page = thunkAPI.getState().promotions.pagePromotions;

    const promotionsResponse = await axiosApi.get<Promotion[]>('/promotions/?limit=' + 10 + '&page=' + page);

    return promotionsResponse.data;
  },
);

export const fetchPromotionsByAdmin = createAsyncThunk<Promotion[], void, { state: RootState }>(
  'promotions/fetchAllByAdmin',
  async (category, thunkAPI) => {
    const page = thunkAPI.getState().promotions.pagePromotions;

    const promotionsResponse = await axiosApi.get<Promotion[]>('/promotions/admin/?limit=' + 10 + '&page=' + page);
    return promotionsResponse.data;
  },
);

export const fetchPromotionsByCategory = createAsyncThunk<
  Promotion[] | [],
  FilterByCategoryForPromotion | undefined,
  { state: RootState }
>('promotions/fetchAllByCategory', async (params, thunkAPI) => {
  const pageByCategory = thunkAPI.getState().promotions.pagePromotionsByCategory;
  if (params?.category && !params.isBirthday) {
    const promotionsResponse = await axiosApi.get<Promotion[]>(
      '/promotions/category/?limit=' + 10 + '&categoryId=' + params.category + '&page=' + pageByCategory,
    );
    return promotionsResponse.data;
  } else if (params?.category && params.isBirthday) {
    const promotionsResponse = await axiosApi.get<Promotion[]>(
      '/promotions/category/?limit=' +
        10 +
        '&categoryId=' +
        params.category +
        '&page=' +
        pageByCategory +
        '&isBirthday=' +
        params.isBirthday,
    );
    return promotionsResponse.data;
  } else if (!params?.category && params?.isBirthday) {
    const promotionsResponse = await axiosApi.get<Promotion[]>(
      '/promotions/category/?limit=' + 10 + '&page=' + pageByCategory + '&isBirthday=' + true,
    );
    return promotionsResponse.data;
  }
  return [];
});

export const fetchPromotionsBySearch = createAsyncThunk<Promotion[] | [], Search | undefined, { state: RootState }>(
  'promotions/fetchPromotionsBySearch',
  async (search, thunkAPI) => {
    const pageBySearch = thunkAPI.getState().promotions.pagePromotionsBySearch;

    if (search) {
      const promotionsResponse = await axiosApi.get<Promotion[]>(
        '/promotions/search/?limit=' + 10 + '&search=' + search.search + '&page=' + pageBySearch,
      );
      return promotionsResponse.data;
    }
    return [];
  },
);

export const fetchPromotionsByCompanyId = createAsyncThunk<Promotion[] | [], string>(
  'promotions/fetchAllByCompanyId',
  async (id) => {
    if (id) {
      const promotionsResponse = await axiosApi.get<Promotion[]>('promotions/companyId/' + id);
      return promotionsResponse.data;
    }
    return [];
  },
);

export const fetchPromotionById = createAsyncThunk<Promotion, string>('promotions/fetchOne', async (id) => {
  const promotionResponse = await axiosApi.get<Promotion | null>('promotions/' + id);
  const promotion = promotionResponse.data;

  if (promotion === null) {
    throw new Error('Not found!');
  }

  return promotion;
});

export const addPromotion = createAsyncThunk<void, PromotionApi>('promotions/addPromotion', async (promotion) => {
  const formData = new FormData();

  formData.append('title', promotion.title);
  formData.append('company', promotion.company);
  formData.append('description', promotion.description);
  formData.append('isAlways', promotion.isAlways);
  formData.append('isBirthday', promotion.isBirthday.toString());

  if (promotion.startDate) {
    formData.append('startDate', promotion.startDate);
  }

  if (promotion.endDate) {
    formData.append('endDate', promotion.endDate);
  }

  if (promotion.image) {
    formData.append('image', promotion.image);
  }

  await axiosApi.post<PromotionApi>('/promotions', formData);
});

export interface PromotionMutation {
  id: string;
  promotion: PromotionApi;
}

export const editPromotion = createAsyncThunk<void, PromotionMutation>('promotions/editPromotion', async (params) => {
  const formData = new FormData();

  formData.append('title', params.promotion.title);
  formData.append('company', params.promotion.company);
  formData.append('description', params.promotion.description);
  formData.append('isAlways', params.promotion.isAlways);
  formData.append('isBirthday', params.promotion.isBirthday.toString());

  if (params.promotion.startDate) {
    formData.append('startDate', params.promotion.startDate);
  }

  if (params.promotion.endDate) {
    formData.append('endDate', params.promotion.endDate);
  }

  if (params.promotion.image) {
    formData.append('image', params.promotion.image);
  }

  await axiosApi.patch<PromotionApi>('/promotions/' + params.id, formData);
});

export const deletePromotion = createAsyncThunk<void, string>('promotions/deletePromotion', async (id) => {
  await axiosApi.delete('/promotions/' + id);
});

export const likePromotion = createAsyncThunk<void, string>('promotions/likePromotion', async (id) => {
  await axiosApi.patch('/promotions/' + id + '/toggleLike');
});
