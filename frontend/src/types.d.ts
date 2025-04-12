export interface Promotion {
  _id: string;
  title: string;
  description: string;
  company: {
    _id: number;
    title: string;
    image: string | null;
    categories: {
      _id: string;
      title: string;
      __v: number;
    }[];
    link: string;
  };
  image: string | null;
  isAlways: boolean;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  isBirthday: boolean;
  isFresh: boolean;
  rating: number;
  userLikes: string[];
}

export interface PromotionApi {
  title: string;
  description: string;
  company: string;
  image: string | null;
  isAlways: string;
  isBirthday: boolean;
  startDate: string | undefined;
  endDate: string | undefined;
}

export interface Company {
  _id: string;
  title: string;
  description: string | null;
  image: string | null;
  categories: {
    _id: string;
    title: string;
    __v: number;
  }[];
  createdAt: string;
  link: string;
}

export interface CompanyApi {
  title: string;
  description: string | null;
  categories: string[] | [];
  image: string | null;
  link: string;
}

export interface FilterByCategoryForPromotion {
  category: string;
  isBirthday: boolean;
}

export interface FilterByCategoryForCompany {
  category: string;
}

export interface Search {
  search: string;
}

export interface Category {
  _id: string;
  title: string;
  parent: {
    _id: string;
    title: string;
    position: null;
    parent: null;
  } | null;
}

export interface CategoryApi {
  title: string;
  parent: string;
}

export interface RegisterMutation {
  username: string;
  password: string;
  displayName: string;
  image: File | null;
}

export interface User {
  _id: string;
  username: string;
  displayName: string;
  image?: string;
  token: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _name: string;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface GlobalError {
  error: string;
}
