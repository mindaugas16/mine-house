import sequelize from '@/database/index';
require('../models/portal.model');
require('../models/real-estate.model');
require('../models/crawler.model');

sequelize
  .sync()
  .then(() => {
    console.info('Migration done');
  })
  .catch((err: Error) => {
    console.log(err);
  });
