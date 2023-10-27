import mongoose from 'mongoose';
import { logger } from './logger';
import { dbUri } from '../secret';

export const connectDb = async () => {
  try {
    await mongoose.connect(dbUri);
    logger.info('Successfully connected to the database');
  } catch (error) {
    // This is only the initial connection error
    logger.error(error);
    process.exit(1);
  }

  // This is the event listener for a connection error after the initial one
  mongoose.connection.on('error', (err) => {
    logger.error(err, 'MongoDB error');
  });
};
