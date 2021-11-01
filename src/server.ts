import app from './app';
import sequelize from './sequelize';

const { PORT, NODE_ENV } = process.env;
const ENV_IS_TEST = NODE_ENV === 'test';

/**
 * Start Polka server.
 */
(async () => {
  await sequelize.sync();

  app.listen(PORT, () => {
    if (ENV_IS_TEST) return;
    console.log(
      '  App is running at http://localhost:%d in %s mode',
      PORT,
      NODE_ENV || 'development'
    );
    console.log('  Press CTRL-C to stop\n');
  });
})();

export default app;
