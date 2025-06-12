import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-17648.c114.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 17648
    }
});

client.on('error', err => console.log('Redis Client Error', err));

const startRedis = async () =>{
    try{
        await client.connect();
        console.log('Successfully connected to redis server')  
    }catch(err){
        console.log('Redis connection failed!', err)
    }
}

startRedis()
export default client








// import {createClient } from 'redis'
// const client = createClient()


// // start connection to redis server
// const startRedis = async () =>{
//     try{
//     await client.connect()
//     console.log('Successfully connected to Redis server')
//     }catch(error){
//         client.on('error', err => console.log(`Unable to connect to Redis server!  \n${err}`))
//     }
// }

// //start connection here
// startRedis()

// export default client