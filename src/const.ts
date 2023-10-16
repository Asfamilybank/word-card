export enum UserType {
  ADMIN = 0,
  USER = 1,
}

export interface IUser {
  username: string;
  userType: UserType;
}

export const UserList: IUser[] = [
  { username: "Tom", userType: UserType.ADMIN },
  { username: "Mary", userType: UserType.USER },
];
