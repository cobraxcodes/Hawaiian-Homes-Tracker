# Hawaiian-Homes-Tracker
The Hawaiian Homes Tracker is the first ever independently built backend REST API built to streamline the managements of the Department of Hawaiian Home Lands (DHHL) waitlist for native Hawaiian homestead applications. 
Inspired by the Hawaiian Homes Commision Act, this project addresses the lack of accessible, modern digital tools for tracking and managing waitlist data. Since the DHHL currently provides this data in misaligned, difficult to read and parse PDF tqables, all 40,000+ application records have been manually parse and structured to meet the API's model requirements. 
This API serves as a free, open resource and backend foundation for future frontend applications that aim to display and manage Hawaiian Homes waitlist data in a user-friendly, accessible way for the community.

## Live demo link
https://hawaiian-homes-tracker.onrender.com/

## Technologies Used
Node.js, Mongoose, MongoDB Atlas, Express, nodemon, morgan, winston, postman, jsonwebtoken, bcrypt, cors, helmet, custom rate limiter, dotenv.

## REST API - Flow Chart
![Flow Chart ](docs/Hawaiian-Homes%20REST%20API.drawio.png)
### USERS MODEL:
- **SIGNUP ROUTE**
/applications/signup
- **LOGIN ROUTE**
/applications/login
- **LOGOUT ROUTE**
/applications/logout
- **DELETE USER**
/applications/user

### APPLICATIONS CRUD:
- **CREATE ROUTE**
/applications/new
- **READ ROUTE (root/landing)**
/
- **UPDATE ROUTE**
/applications/:id 
- **DELETE ROUTE**
/applications/:id 


### APPLICATIONS PARAMS:
- **GET BY RANK**
/applications/rank
- **GET BY FULL NAME**
/applications/name/:fullname
- **GET BY LAST NAME**
/applications/lastname/:lastname
- **GET BY ZIPCODE**
/applications/zipcode/:zipcode


## Features
- **RESTful API Endpoints:**
Provides GET, POST, PATCH, and DELETE routes to manage Hawaiian Homes waitilist applicant data.
- **Manually Parse Waitlist Data:**
Contains over 40,000+ applicant records manually parsed from misaligned PDF tables provided by DHHL.
- **MongoDB Atlas Integration:**
Stores all applicant records in a secure, cloud-hosted MongoDB Atlas database.
- **Modular Controller Structure:**
Cleanly separates route handling and business logic for maintainable, scalable code.
- **CRUD Operations for Applications**
- **Error Handling and Validation:**
Includes error handlings for known and unknown errors using try/catch, global error handler, invalid requests and database errors.
- **Open Foundation for Frontend Development**
- **Application Search and Filitering**
Allows users to search applicants by name, rank by area, or zipcode.


## Future Roadmap
- Frontend Application: Build a React-baesd frontend interface to display, search, and filter Hawaiian Homes waitlist data in a clean, user-friendly design.
- Pagination to get routes
- User Authentication and Admin Tools Interface: Implement frontend interface to connect with jwt functions build in this REST API.
- Mobile-Friendly Interface: Ensure the frontend is responsive and accessible for mobile devices.
- Integrate a notification system for status changes.
- Community feedback and suggestion form via frontend.
