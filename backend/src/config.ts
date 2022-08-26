// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
export default {
  DB_URI: process.env.DATABASE_URI,
  SECRET: process.env.SECRET,
  BC_PRIVATE_KEY: process.env.PRIVATE_KEY,
};
