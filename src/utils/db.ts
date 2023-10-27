import mongoose from 'mongoose';
import { logger } from './logger';
import { dbUri } from '../secret';

export const connectDb = async () => {
  try {
    await mongoose.connect(dbUri);
    logger.info('Successfully connected to the database');
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};
