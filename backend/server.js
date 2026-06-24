require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/db');
require('./src/models'); // ensure associations are registered

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Keep schema in sync with models. For production use proper migrations instead.
    await sequelize.sync();
    console.log('Database synced.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
