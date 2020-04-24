import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from './middleware/cors';
import errorHandler from './middleware/error-handler';
import routes from './routes';
import sequelize from './database/db';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(cors);
app.use(errorHandler);
app.use('/api', routes);

sequelize
  .authenticate()
  .then(() => {
    const server = http.createServer(app);
    server.listen(process.env.BACKEND_PORT || 3000, () => {
      console.log('Server is running on port', (server.address() as any).port);
    });
  })
  .catch((error: Error) => {
    throw error;
  });
