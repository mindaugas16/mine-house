import * as http from 'http';
import app from './app';
import sequelize from './database';
import { Cron } from './cron';

(async () => {
  try {
    await sequelize.authenticate();
    const server = http.createServer(app);

    server.listen(process.env.APP_SERVER_PORT || 3000, () => {
      console.info('Server is running on port', (server.address() as any).port);
      const cron = new Cron();
      cron.start();
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
})();
