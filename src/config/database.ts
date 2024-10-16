import { Sequelize } from 'sequelize-typescript';
import { models } from '../models';

interface SequelizeConfig {
  dialect: 'postgres' | 'mysql' | 'sqlite' | 'mariadb' | 'mssql';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  storage: string;
  models: any[];
  logging: boolean | ((sql: string) => void);
}

const sequelizeConfig: SequelizeConfig = {
  dialect: 'sqlite',
  storage: ':memory:',
  models,
  logging: false,
};

const sequelize: Sequelize = new Sequelize(sequelizeConfig);

export default sequelize;
