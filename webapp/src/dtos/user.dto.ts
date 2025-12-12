export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  surname: string;
  name: string;
  birthDate: Date;
}

export interface User {
  email: string;
  surname: string;
  name: string;
  birthDate: Date;
}
