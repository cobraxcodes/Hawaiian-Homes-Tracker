import {createClient } from 'redis'
const client = createClient()


// start connection to redis server
const startRedis = async () =>{
    try{
    await client.connect()
    console.log('Successfully connected to Redis server')
    }catch(error){
        client.on('error', err => console.log(`Unable to connect to Redis server!  \n${err}`))
    }
}

//start connection here
startRedis()

export default client