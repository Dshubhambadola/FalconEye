import app from './app';
import { connectDB } from './config/db';
import dotenv from 'dotenv';

import { config as jestConfig } from 'dotenv';
jestConfig({ path: '.env.test' });

dotenv.config();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export default app;