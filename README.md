# FoodShare API 🍽️  
The backend server for the FoodShare platform, enabling seamless food sharing, management, and request handling.  

## Purpose 🛠️  
Provides RESTful APIs to handle CRUD operations, user authentication, and secure data management for the FoodShare platform.  

## Live API URL 🌐  
Base URL: [https://your-api-url.com](https://your-api-url.com)  

## Key Features ✨  
- **CRUD Operations**: Create, Read, Update, and Delete functionalities for food and requests.  
- **Authentication**: Secure user authentication using Firebase and JWT.  
- **Protected Routes**: Access control for private routes with token verification.  
- **Sorting and Filtering**: APIs for sorting food by expiration date and filtering by status.  
- **Pagination**: Efficient data handling for large datasets.  

## API Endpoints 📖  
### Authentication:  
- **POST** `/api/login`: User login with email and password.  
- **POST** `/api/register`: User registration with email and password.  
- **POST** `/api/auth/google`: Social login with Google.  

### Food Management:  
- **GET** `/api/foods`: Fetch all available food items.  
- **POST** `/api/foods`: Add new food (Private).  
- **PATCH** `/api/foods/:id`: Update food details (Private).  
- **DELETE** `/api/foods/:id`: Delete food entry (Private).  

### Request Management:  
- **GET** `/api/requests`: Fetch all user requests (Private).  
- **POST** `/api/requests`: Create a food request (Private).  

### Miscellaneous:  
- **GET** `/api/foods/search`: Search food by name.  
- **GET** `/api/foods/sort`: Sort food by expiration date.  

## Technologies Used 🛠️  
- **Backend Framework**: Node.js with Express.js.  
- **Database**: MongoDB with Mongoose for data modeling.  
- **Authentication**: Firebase Authentication with JWT for token-based security.  
- **API Testing**: Postman.  
- **Environment Variables**: dotenv for secure management of credentials.  

## Deployment 🖥️  
- **Hosting**: Vercel for server-side deployment.  
- **Database Hosting**: MongoDB Atlas for secure cloud database management.  

## Additional Features 🚀  
- **CORS Handling**: Configured for cross-origin requests.  
- **Error Handling**: Graceful error responses for invalid inputs or unauthorized access.  
- **Middleware**: Custom middleware for request validation and token verification.  