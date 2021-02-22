import cron from 'node-cron';
import Crawler from './models/crawler.model';
import { runSingleCrawler } from './controllers/crawler.controller';

export class Cron {
  start() {
    cron.schedule('0 8,12,20 * * *', async () => {
      console.log('running a task every minute');
      const crawlers = await Crawler.findAll({});
      for (const crawler of crawlers) {
        console.info(`Crawler ${crawler.id} started`);
        const results = await runSingleCrawler(crawler.id);
        console.info(`Crawler ${crawler.id} finished with ${results} new entries`);
      }
    });
  }
}
