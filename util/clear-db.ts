import sequelize from '../src/sequelize';

(async () => {
  await sequelize.sync({ force: true });
  process.exit(0);
})();
