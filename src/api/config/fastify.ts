let logLevel
switch (process.env.NODE_ENV) {
  case 'development':
    logLevel = 'debug'
    break
  case 'test':
    logLevel = 'silent'
    break
  default:
    logLevel = 'info'
    break
}

export default {
  logger: {
    level: logLevel,
    redact: ['err.stack'],
  },
}
