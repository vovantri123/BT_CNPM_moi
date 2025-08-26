// Type definitions cho các module tự định nghĩa
declare module '../models/index' {
  import { Database } from '../types/database';
  const db: Database;
  export default db;
}

declare module '../config/viewEngine' {
  import { Application } from 'express';
  const configViewEngine: (app: Application) => void;
  export default configViewEngine;
}

declare module '../config/configdb' {
  const connectDB: () => Promise<void>;
  export default connectDB;
}

declare module '../route/web' {
  import { Application } from 'express';
  const initWebRoutes: (app: Application) => void;
  export default initWebRoutes;
}

declare module '../services/CRUDService' {
  interface UserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    gender: string;
    roleId: string;
    id?: string;
  }

  const CRUDService: {
    createNewUser: (data: UserData) => Promise<string>;
    getAllUser: () => Promise<any[]>;
    getUserInfoById: (userId: string) => Promise<any>;
    updateUser: (data: UserData) => Promise<any[]>;
    deleteUserById: (userId: string) => Promise<void>;
  };
  export default CRUDService;
}
