import winston from 'winston'

export default logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports:[
        new winston.transports.Console()
    ]
})

