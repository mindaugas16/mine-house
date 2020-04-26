import sequelize from '@/database/index';

sequelize
  .sync()
  .then(() => {
    console.info('Migration done');
  })
  .catch((err: Error) => {
    console.log(err);
  });
