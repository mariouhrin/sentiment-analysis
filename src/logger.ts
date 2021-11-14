import pino from 'pino';

function setLogLevel(): string {
  switch (process.env.NODE_ENV) {
    case 'test':
      return 'silent';
    default:
      return 'info';
  }
}

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'hostname,pid',
      translateTime: 'yyyy-mm-dd HH:MM:ss.l'
    }
  },
  level: setLogLevel()
});
