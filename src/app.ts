import logger from './logger';
import app from './server';

const port: number | string = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});
