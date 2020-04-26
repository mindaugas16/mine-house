import * as http from 'http';
import app from './app';
import sequelize from './database';

sequelize
  .authenticate()
  .then(() => {
    const server = http.createServer(app);

    server.listen(process.env.PORT || 3000, () => {
      console.info('Server is running on port', (server.address() as any).port);
    });
  })
  .catch((err: Error) => {
    console.error(err);
    throw err;
  });
