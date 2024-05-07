# Cake Bakery 🍰

Welcome to Cake Bakery, a full-stack web application for managing cake orders seamlessly! Cake Bakery is a comprehensive web application designed to streamline the management of cake orders effortlessly. It offers a seamless experience for both customers and administrators, ensuring smooth interactions and efficient order processing. Throughout the development process, I gained valuable insights into building a full-fledged e-commerce platform from scratch. Implementing features like "Add to Cart" functionality and real-time order synchronization using Socket.io has enriched my understanding and expertise in web development.

## Quick Demo

- **Live link** - https://cake-bakery.onrender.com/


## Technologies Used
#### Frontend:
- HTML
- Tailwind CSS (for contemporary styling)
- JavaScript
  
#### Backend:
- Node.js
- Express.js
- MongoDB (utilizing Mongoose for data modeling)
- Template Engine (ejs i.e., for managing layouts)

#### Real-time Communication:
- Socket.io (for synchronizing customers and admins)

#### Other 
- Noty: Display real-time notifications for order updates and system alerts.
- Laravel: Utilized for backend API development, including user authentication.
- Passport: Secure authentication and API token generation for accessing protected resources.

## Key Functionality:
1. Registration: Users can create an account to access all features.
2. Login: Secure login functionality for registered users.
3. Add to Cart: Conveniently add cakes to the shopping cart for ordering.
4. Cart Management: View selected items and the total price in the cart section.
5. Order Placement: Seamless order placement process with provision for phone number and address.
6. Order Tracking: Track the status of placed orders and view detailed information, including an interactive order map displaying confirmation and delivery status.
7. Admin Panel: Dedicated interface for administrators to manage all order details, including updates on order status and communication with customers.

## Getting Started 

**Note:** *Ensure that Node.js (npm) is installed before proceeding.*

Follow the steps below to install and run the project on your local machine.

**1. Clone this repository:**
  ```bash
  git clone https://github.com/parhladSingh/Cake-Bakery.git
  ```
**2. Go to the project directory:**
  ```bash
  cd Cake-Bakery
  ```
**3. Set Up Environment Variables:**
  Create a `.env` file in the root directory and add the following:
  ```bash
  COOKIE_SECRET = "{any_secret_code_for_cookies}"
  MONGO_URL = "{mongoDB_URL_with_cake_as_database_name}"
  ```
**4. Install all dependencies:**
  ```bash
  npm install
  ```
**5. Start development server:**
  ```bash
   npm run dev
  ```
**6. Open a second terminal & run:**
  ```bash
  npm run watch
  ```
**7. Visit `http://localhost:3040` to see the magic.**

## Test Users

**Customer -**  *Email* : parhladsingh760@gmail.com, *Password* : 123  

**Admin -**  *Email* : admin@gmail.com, *Password* : 654
