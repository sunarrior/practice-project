export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  account: string;
  password: string;
}

export interface UserToken {
  id: number;
  username: string;
  userip: string | undefined;
  useragent: string | undefined;
  role: string;
}

export interface RecoveryData {
  account?: string;
  token?: string;
  password?: string;
}

export interface UserData {
  id?: number;
  usernames?: string;
  email?: string;
  createdAt?: Date;
  role?: string;
  status?: boolean;
  isBlocked?: boolean;
  fullName?: string;
  phone?: string;
  dob?: Date;
  gender?: boolean;
  deliveryAddress?: string;
  avatarUrl?: string;
}
