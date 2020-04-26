import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import cors from './middleware/cors';
import errorHandler from './middleware/error-handler';
import routes from './routes';

const app = express();

dotenv.config();

app.use(bodyParser.json());
app.use(cors);
app.use(errorHandler);
app.use('/api', routes);

export default app;
