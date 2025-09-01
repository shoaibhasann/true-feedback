# True Feedback

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/) 
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/) 
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com/) 
[![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=javascript&logoColor=white)](https://github.com/colinhacks/zod) 
[![Bcrypt](https://img.shields.io/badge/Bcrypt-003366?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://www.npmjs.com/package/bcrypt) 
[![Resend](https://img.shields.io/badge/Resend-FF6F61?style=for-the-badge)](https://resend.com/) 
[![React Email](https://img.shields.io/badge/React_Email-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.email/)

---

## Overview

**True Feedback** is a full-stack web application built with **Next.js**, allowing users to create and receive feedback from the community.  

Users can open a feedback request, and other True Feedback users can respond. The app emphasizes **community interaction, simplicity, and secure user management**.

---

## Features

- User authentication with **NextAuth.js** (signup, signin)  
- Email verification during registration using **Resend** and **React Email** templates  
- Forgot password functionality  
- Input validation using **Zod**  
- Database management with **MongoDB** and **Mongoose**  
- Password hashing with **Bcrypt**  
- Two main models:  
  - **User**: Stores user info and authentication details  
  - **Message (Feedback)**: Stores feedback content and timestamp (`content`, `createdAt`)  

---

## Tech Stack

- **Frontend & Backend**: Next.js  
- **Authentication**: NextAuth.js  
- **Database**: MongoDB + Mongoose  
- **Validation**: Zod  
- **Email Templates**: React Email  
- **Email Sending**: Resend  
- **Password Hashing**: Bcrypt  

---


---

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/shoaibhasann/true-feedback.git
cd true-feedback
```

2. Install Dependencies:

```
npm install
```

3. Create a .env.local file in the root directory:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email@example.com

```

4. Run the development server:

```
npm run dev

-> Open http://localhost:3000
 to view the app.
```

## Usage
- Signup & Email Verification: New users must verify their email before logging in.

- Login: Secure authentication using NextAuth.js.

- Create Feedback: Users can open a feedback request.

- Send Feedback: Other users can respond to feedback requests.

- Forgot Password: Users can reset their password securely.

## Future Enhancements

- Pagination for feedback messages

- Real-time notifications for new feedback

- User profile customization and avatars

- Admin dashboard for managing users and messages

## License

```This project is licensed under the MIT License.```

## Contact

``Made by ❤️ Shoaib`` 
