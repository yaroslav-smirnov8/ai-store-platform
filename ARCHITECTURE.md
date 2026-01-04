### **AI Store: Architecture & System Design Analysis**

This document provides a comprehensive overview of the AI Store project, a sophisticated e-commerce platform for selling digital courses, architected with a modern technology stack and a unique, secure integration with Telegram.

---

### **1. High-Level Architecture Overview**

The system is a classic client-server application with a decoupled frontend and backend, designed for containerized deployment.

*   **Frontend**: A React-based Single-Page Application (SPA) that runs as a **Telegram Web App**. This is the primary user interface, providing a rich, interactive experience directly within the Telegram messenger.
*   **Backend**: A high-performance asynchronous API built with Python and FastAPI. It handles all business logic, data persistence, and communication with external services.
*   **Database**: A PostgreSQL database serves as the persistent data store, managed via SQLAlchemy.
*   **Deployment**: The entire application (frontend, backend, database) is orchestrated using Docker Compose, ensuring consistent and reproducible deployments. The frontend is served by an Nginx container, which also acts as a reverse proxy for the backend API, a standard and robust production pattern.

#### **Data & Control Flow**

1.  **User Interaction**: Users interact with the store through the React application embedded within their Telegram client.
2.  **Authentication**:
    *   **End-Users**: Authenticated seamlessly and securely. The Telegram Web App provides initialization data (`initData`), which is cryptographically signed. The frontend sends this data to the backend in an `X-Telegram-Init-Data` header. The backend verifies the signature, extracts the user's Telegram ID, and uses it to identify or create a `User` record on-the-fly. This is a clever, passwordless authentication model.
    *   **Administrators**: Use a separate, traditional email/password login flow that issues JWT tokens for authenticating subsequent API requests.
3.  **Core Purchase Workflow**:
    *   A user selects a product in the Telegram Web App.
    *   The frontend sends a request to the backend to create an order.
    *   The backend creates a pending `Order` and generates a payment link by calling the **Yookassa API**.
    *   The user is redirected to Yookassa to complete the payment.
    *   Yookassa sends an asynchronous **webhook** notification to a dedicated endpoint on the backend to confirm payment.
    *   The backend verifies the webhook, updates the `Order` and `Payment` status, and triggers a **Telegram bot notification** to an admin channel to signal the successful sale.

---

### **2. Technology Stack Breakdown**

*   **Programming Languages**:
    *   Backend: **Python 3.11**
    *   Frontend: **JavaScript (ES6+)** with React

*   **Frameworks & Major Libraries**:
    *   **Backend**:
        *   **FastAPI**: For building the high-performance, asynchronous REST API.
        *   **SQLAlchemy (2.0 with async support)**: ORM for database interaction.
        *   **Pydantic**: For data validation and settings management.
        *   **Alembic**: For database schema migrations.
        *   **Celery & Redis**: For managing background tasks (e.g., notifications).
        *   **Passlib & python-jose**: For password hashing and JWT management.
    *   **Frontend**:
        *   **React**: Core UI library.
        *   **Axios**: For making HTTP requests to the backend.
        *   **Tailwind CSS**: For utility-first styling.

*   **Database**:
    *   **PostgreSQL**: Primary relational database.

*   **External API Integrations**:
    *   **Yookassa**: For processing payments.
    *   **Telegram Bot API**: For sending admin notifications upon successful purchases.
    *   **Telegram Web App API**: For the frontend user interface and authentication.

---

### **3. System Design Description**

#### **Main Data Entities & Database Schema**

The database schema, reconstructed from `backend/models.py`, revolves around five core entities:

1.  **`User`**: Represents a customer. Uniquely identified by `telegram_id`, which is populated automatically from the Telegram authentication data. Stores basic user info.
2.  **`Product`**: Represents a digital course or item for sale. Contains fields like `name`, `description`, `price`, `category`, and `image_url`.
3.  **`Order`**: Represents a customer's purchase attempt. It links a `User` to a `Product` and tracks the `status` (e.g., `pending`, `completed`, `cancelled`).
4.  **`Payment`**: Records a payment transaction associated with an `Order`. It stores the `yookassa_payment_id`, `amount`, and `status`.
5.  **`Click`**: A simple model for tracking user interactions or events for analytics purposes, linking a `user_id` to an event `type` and `details`.

#### **Key Workflows & Features**

*   **Product & Order Management**: Full CRUD capabilities for products and orders, exposed via the REST API and restricted to admin users.
*   **Secure User Authentication**: Novel, passwordless authentication for end-users via signed Telegram data.
*   **Secure Admin Authentication**: Standard JWT-based authentication for the admin panel.
*   **Asynchronous Payment Processing**: Reliable payment handling via Yookassa webhooks, ensuring that orders are updated even if the user closes the payment window.
*   **Background Task Processing**: Use of Celery for handling asynchronous operations like sending notifications without blocking API responses.
*   **User Analytics**: Basic event tracking via the `Click` model to monitor user behavior.
*   **Containerized Deployment**: Fully containerized with Docker for easy setup, scaling, and deployment.

---

### **4. Unique or Technically Strong Aspects**

*   **Telegram-Native Architecture**: The deep, secure integration with Telegram is the project's standout feature. Using the Telegram Web App for both the frontend UI and user authentication is a highly effective and modern approach for building applications within the Telegram ecosystem. It provides a seamless user experience and leverages Telegram's existing user base and trust.
*   **Asynchronous-First Backend**: The consistent and correct use of `async`/`await` throughout the entire backend stack (FastAPI, SQLAlchemy, `httpx` for external calls) is a significant engineering strength. It ensures the application is highly performant, scalable, and resilient under load.
*   **Robust Payment Webhook Handling**: The implementation of the Yookassa webhook endpoint is well-designed. It's a critical component for an e-commerce site, and its asynchronous, decoupled nature ensures payment confirmations are processed reliably.
*   **Clean Separation of Concerns**: The backend code is well-organized. Business logic is separated into routers, data access is handled by a `crud.py` layer, and external service interactions are encapsulated within a `services` directory. This makes the codebase maintainable and easy to extend.
*   **Developer Experience**: The project includes numerous scripts (`.bat` files) for simplifying common development and testing tasks (e.g., `simple_dev.bat`, `test_backend.bat`), indicating a thoughtful approach to developer ergonomics.
