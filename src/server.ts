import express, { Request, Response, NextFunction, Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import logger from './logger';
import sequelize from './config/database';
import userRoutes from './routes/index';
import { HttpStatus } from './utils/httpStatus';

const app: Application = express();

const swaggerDocument = yaml.parse(
  fs.readFileSync(path.join(__dirname, './docs/api.yaml'), 'utf8')
);

app.use(express.json());
app.use('/', userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

sequelize
  .authenticate()
  .then(() => {
    logger.info('Database connected.');

    sequelize
      .sync({ alter: true })
      .then(() => logger.info('Database & tables created!'))
      .catch(err => logger.error('Failed to sync models:', err));
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });

app.get('/', (req: Request, res: Response) => {
  logger.info('Root Path');
  res.json({ status: HttpStatus.OK, message: 'Welcome to Cuery!' });
});

// Handles all errors
app.use((err: any, req: Request, res: Response, next: NextFunction): any => {
  if (process.env.NODE_ENV === 'production') {
    return res
      .status(err.status || HttpStatus.BAD_REQUEST)
      .send({ success: false });
  }
  if (err) logger.error(`Error: ${err.message}`);
  return res
    .status(err.status || HttpStatus.BAD_REQUEST)
    .send({ success: false, message: err.message });
});

const port: number | string = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});
