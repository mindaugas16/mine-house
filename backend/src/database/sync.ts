import sequelize from '@/database/index';
require('../models/portal.model');
require('../models/real-estate.model');

sequelize
  .sync({ force: true })
  .then(() => {
    console.info('Migration done');
  })
  .catch((err: Error) => {
    console.log(err);
  });
