export interface LoginData {
  account: string;
  password: string;
}

export interface RegisterData {
  [key: string]: string;
  fullName: string;
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export interface RecoveryData {
  password: string;
  repeatPassword: string;
}

export interface UserData {
  id?: number;
  username?: string;
  email?: string;
  createdAt?: string;
  role?: string;
  status?: string;
  fullName?: string;
  phone?: string;
  dob?: string;
  gender?: boolean;
  deliveryAddress?: string;
  avatarUrl?: string;
  isBlocked?: boolean;
}

export interface UserDataUpdate extends UserData {
  filePath?: string;
}

export interface UserToken {
  data: {
    id: number;
    username: string;
    role: string;
    userAgent: string;
    userIp: string;
  };
}
