import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',  // Change le niveau de log selon tes besoins (info, warn, error)
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

export default logger;

// Ajoutez cela à la fin du fichier logger.ts pour tester
logger.info("Test de log direct dans le fichier app.log");
