import pinoLogger from 'pino';
import dayjs from 'dayjs';

export const logger = pinoLogger({
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});
