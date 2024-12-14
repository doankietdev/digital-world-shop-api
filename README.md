# Digital World Shop API

Welcome to the **Digital World Shop API** repository! This project provides a robust backend API for an e-commerce platform, built with modern web technologies to ensure scalability, performance, and ease of use.

## Architecture

![image](https://github.com/user-attachments/assets/768752a1-98a8-4d4d-b1ec-a7d183b60fb8)

## Features

- **Caching**
  - **Redis**
- **Authentication and Authorization**
  - Login with system account
  - Login with **Google**
  - Sign up
  - Detect hackers appropriating tokens
  - Role based access control
- **Currency conversion**
  - Integration with **Currency Freaks** service
- **Payment Integration**:
  - **MoMo Wallet**
  - **PayPal**
- **Shipping Management**:
  - Integration with **GHN** service
- **File Uploading**
  - Integration with **Cloudinary** service
- **Product Management**
- **Cart Management**
- **Discount Management**
- **Order Management**
- **Address Management**
- **User Management**
- **...**

---

## Technologies Used

### Backend Framework:

- **Node.js** with **Express.js** for building the API

### Database:

- **MongoDB** for data storage

### Caching:

- **Redis** for caching and session storage

### Deployment:

- **Docker** for containerization and deployment

### Payment Gateways:

- **MoMo**
- **PayPal**

---

## Deployment Environments

<!-- - **Staging**: [staging.digitalworldshop.com](https://staging.digitalworldshop.com) -->

- **Staging**: [digital-world-shop-api.onrender.com](https://digital-world-shop-api.onrender.com)

  - **Testing account:**
    Email: doankietdev.test@gmail.com
    Password: Test@123
  - **Testing payment accounts:**

    - **Paypal**:
      Email: `sb-d0924333115240@personal.example.com`
      Password: `Z64g<a5T`
    - **MoMo**

      - Debit Card

        | No  | Name         | Card Number         | Release Date | OTP | Test Case           |
        | --- | ------------ | ------------------- | ------------ | --- | ------------------- |
        | 1   | NGUYEN VAN A | 9704 0000 0000 0018 | 03/07        | OTP | Successful          |
        | 2   | NGUYEN VAN A | 9704 0000 0000 0026 | 03/07        | OTP | Card Locked         |
        | 3   | NGUYEN VAN A | 9704 0000 0000 0034 | 03/07        | OTP | Insufficient Funds  |
        | 4   | NGUYEN VAN A | 9704 0000 0000 0042 | 03/07        | OTP | Card Limit Exceeded |

      - Credit Card

        | No  | Name         | Number              | Expiry Date | CVC | OTP    | Test Case       |
        | --- | ------------ | ------------------- | ----------- | --- | ------ | --------------- |
        | 1   | NGUYEN VAN A | 5200 0000 0000 1096 | 05/25       | 111 | OTP    | Card Successful |
        | 2   | NGUYEN VAN A | 5200 0000 0000 1104 | 05/25       | 111 | OTP    | Card failed     |
        | 3   | NGUYEN VAN A | 4111 1111 1111 1111 | 05/25       | 111 | No OTP | Card Successful |

## Contact

For any inquiries or support, please contact:

- Email: doankietdev@gmail.com
- GitHub: [doankietdev](https://github.com/doankietdev)
