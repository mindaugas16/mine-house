import * as http from 'http';
import app from './app';
import sequelize from './database';

(async () => {
  try {
    await sequelize.authenticate();
    const server = http.createServer(app);

    server.listen(process.env.APP_SERVER_PORT || 3000, () => {
      console.info('Server is running on port', (server.address() as any).port);
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
})();
