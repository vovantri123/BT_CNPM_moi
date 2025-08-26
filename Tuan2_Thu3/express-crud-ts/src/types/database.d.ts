// Type definitions cho database models
export interface User {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  gender: boolean;
  image?: string;
  roleId: string;
  positionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  save(): Promise<void>;
  destroy(): Promise<void>;
}

export interface UserModel {
  create(data: any): Promise<User>;
  findAll(options?: any): Promise<User[]>;
  findOne(options?: any): Promise<User | null>;
}

export interface Database {
  User: UserModel;
  sequelize: any;
  Sequelize: any;
}

declare const db: Database;
export default db;
