// A simple logger for MVP. For production, consider using a more robust logging library like Winston or Pino.

const logger = {
    info: (message, ...args) => {
        console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...args);
    },
    warn: (message, ...args) => {
        console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...args);
    },
    error: (message, ...args) => {
        console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...args);
    },
    debug: (message, ...args) => {
        if (process.env.NODE_ENV !== 'production') { // Only log debug in non-production environments
            console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, ...args);
        }
    }
};

module.exports = logger;