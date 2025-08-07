export interface IProduct {
  documentId?: string | undefined;
  thumbnail?: {
    url: string;
  };
  title: string;
  description: string;
  price: number;
  category?: ICategory;
  stock?: number;
}

export interface ICategory {
  id?: number;
  documentId?: string;
  title?: string;
}

export interface ILoginData {
  identifier: string;
  password: string;
}

export interface IUser {
  id?: number;
  username: string;
  email: string;
}

export interface ILoginResponse {
  jwt: string;
  user: IUser;
}

export interface ICart extends IProduct {
  qty: number;
}

export interface IDashboardProduct {
  // thumbnail?: {
  //   url: string;
  // };
  title: string;
  description: string;
  price: number;
  category?: string | undefined;
  stock?: number;
}


export interface UpdateProductCache {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  thumbnail?: { url: string };
}