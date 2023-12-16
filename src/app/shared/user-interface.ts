export interface SignUpData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}


export interface LoginData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

