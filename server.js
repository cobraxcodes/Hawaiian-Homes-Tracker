import limiter from './middleware/rate-limiter.js'
import cors from 'cors'
import helmet from 'helmet'
import {getAll, getAreaCode, getLastName, getRank, getZipCode, 
 getByFullName, createApp, updateApp, deleteApp,signup, login, logout, deleteUser,getUserApps,
 updateUserApp,
 deleteUserCreatedApp} from './controllers/controller.js'
import express from 'express'
import morgan from 'morgan'
import logger from './utils/logger.js'
import {connect} from './database/database.js'
import authenticate from './middleware/authenticate.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.js'


const app = express() //creating express app
const port = process.env.PORT || 10000;; // setting port here

// no templating engine


// ~~~~ MIDDLEWARES ~~~~
app.use(async (req,res,next) =>{
    try{
       await limiter.consume(req.ip) // checks user IP address if rate limit quota has been reached
        // if not yet reached, proceed to next() middleware . if yes, move to catch block
        next()
    }catch(err){  // checkign err (contains the rate limiter response when the rate limit exceeds)
          if(err.remainingPoints <= 5){
        return res.status(429).send('Too Many Requests!')
    }
    next(err)
    }
})
app.use(cors())
app.use(helmet())
app.use(express.json()) 
app.use(morgan(':method: url| Status: :status | Time: :response-time ms| Date: :date[clf]'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ~~~~~~~~USING CONNECT FN TO CONNECT TO DATABASE ~~~~~~~

const start = async() =>{
    try{
        await connect()
        app.listen(port, () =>{
            console.log(`Server is listening on port ${port}`) // change later to a winston logger
        })
    }catch(error){
        logger.error(`Unable to connect to server, Error: ${error.message} \n Stack Trace: ${error.stack}`)
    }
}

start()

// ~~~~~~~ROUTES~~~~~~~
/**
 * @swagger
 * /applications/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully!
 *       400:
 *         description: Missing or invalid credentials
 */
app.post('/applications/signup', signup)

/**
 * @swagger
 * /applications/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login!
 *       401:
 *         description: invalid Login! No user found!
 */
app.post('/applications/login', login)

/**
 * @swagger
 * /applications/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful!
 *       400:
 *         description: Already logged out
 */
app.post('/applications/logout', logout)

/**
 * @swagger
 * /applications/user:
 *   delete:
 *     summary: Delete a user account
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
app.delete('/applications/user', deleteUser)

// // USER ROUTES
// app.post('/applications/signup', signup) // post route for user signup
// app.post('/applications/login', login) // post route for user login 
// app.post('/applications/logout', logout) // post route for logout
// app.delete('/applications/user', deleteUser) //delete route to delete user




// QUERY ROUTES - lEGACY DATA
/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Gets all applications
 *     tags: [Applications]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - applicationDate
 *               - areaCode
 *               - rank
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Doe, John"
 *               applicationDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-09"
 *               areaCode:
 *                 type: integer
 *                 example: 101
 *               rank:
 *                 type: string
 *                 example: "44"
 *               zipcode:
 *                 type: string
 *                 example: "0000"
 *     responses:
 *       200:
 *         description: Applications
 *       401:
 *         description: None
 */
app.get('/applications', getAll) // get all route

/**
 * @swagger
 * /applications/rank/{rank}:
 *   get:
 *     summary: Gets application by rank route parameter
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         rank: rank 
 *         schema:
 *           type: string
 *         required: true
 *         description: Only rank of the applicant (e.g., "1")
 *     responses:
 *       200:
 *         description: Application found
 *       401:
 *         description: No Application Found
 */
app.get('/applications/rank/:rank', getRank) // get all ranks route

/**
 * @swagger
 * /applications/name/{fullname}:
 *   get:
 *     summary: Gets application by full name route parameter
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: fullname
 *         schema:
 *           type: string
 *         required: true
 *         description: Full name of the applicant (e.g., "Doe, John")
 *     responses:
 *       200:
 *         description: Application found
 *       401:
 *         description: No Application Found
 */
app.get('/applications/name/:fullname', getByFullName) // get by full name


/**
 * @swagger
 * /applications/lastname/{lastname}:
 *   get:
 *     summary: Gets application by last name route parameter
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: lastname
 *         schema:
 *           type: string
 *         required: true
 *         description: Only last name of the applicant (e.g., "Doe")
 *     responses:
 *       200:
 *         description: Application found
 *       401:
 *         description: No Application Found
 */
app.get('/applications/lastname/:lastname', getLastName) // get by last name

/**
 * @swagger
 * /applications/zipcode/{zipcode}:
 *   get:
 *     summary: Gets application by zipcode route parameter
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         zipcode: zipcode
 *         schema:
 *           type: string
 *         required: true
 *         description: Only last name of the applicant (e.g., "Doe")
 *     responses:
 *       200:
 *         description: Application found
 *       401:
 *         description: No Applications Found For Zipcode ${req.params.zipcode}
 */
app.get('/applications/zipcode/:zipcode', getZipCode) // get route for zipcodes


/**
 * @swagger
 * /applications/areacode/{areacode}:
 *   get:
 *     summary: Gets application by areacode route parameter
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         areacode: areacode
 *         schema:
 *           type: number
 *         required: true
 *         description: Only areacode of the applicant (e.g., "193")
 *     responses:
 *       200:
 *         description: Application found
 *       401:
 *         description: No Applications Found For Area Code ${req.params.areacode}`
 */
app.get('/applications/areacode/:areacode', getAreaCode) // get by areacode

/**
 * @swagger
 * /applications/{id}:
 *   patch:
 *     summary: Updates application created by user
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: 
 *         useCreatedAppId: id
 *         schema:
 *            schema:
 *             type: object
 *             required:
 *               - name
 *               - applicationDate
 *               - areaCode
 *               - rank
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Doe, John"
 *               applicationDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-09"
 *               areaCode:
 *                 type: integer
 *                 example: 101
 *               rank:
 *                 type: string
 *                 example: "44"
 *               zipcode:
 *                 type: string
 *                 example: "0000"
 *         required: true
 *         description: Use application userCreatedApp Id as route parameter (e.g., "68168aq218decea4548")
 *     responses:
 *       200:
 *         description: ${existingApp.name} successfully updated!
 *       401:
 *         description: Something went wrong. Please try again later!
 */
//UPDATE ROUTE
app.patch('/applications/:id', authenticate, updateApp) // updates an application  - authenticate ok

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Deletes an application by its ID
 *     tags: [Applications]
 *     description: Use application userCreatedAppId as route parameter (e.g., "193")
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the application to delete
 *     responses:
 *       200:
 *         description: Application Successfully Deleted!
 *       401:
 *         description: No Application Found!
 */
// DELETE ROUTE
app.delete('/applications/:id', authenticate, deleteApp) // deletes an application - authenticate ok 


// QUERY ROUTES - USER CREATED DATA
app.post('/applications/new', authenticate, createApp) // post route for creating an app by user- authenticate ok 
app.get('/applications/user/posts', authenticate, getUserApps) // get user created applications
app.patch('/applications/user/posts/:id', authenticate, updateUserApp) // update user created application
app.delete('/applications/user/posts/:id', authenticate, deleteUserCreatedApp) // update user created application


// ~~~~~~ GLOBAL ERROR HANDLER ~~~~~~~
app.use((err,req,res,next)=>{
    logger.error(`Something went wrong! Error: ${err.message} \n Stack Trace:${err.stack}`)
     res.status(500).send('Something went wrong! Please try again later!')
})