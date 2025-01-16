
# **Tempo Platform**

Tempo Platform is a full-stack job platform designed to connect employers and job seekers. The application consists of a backend (Node.js with MongoDB) and a frontend (React) hosted in a scalable AWS infrastructure using Terraform for infrastructure as code (IaC).

---

## **Project Structure**

```
Tempo/
├── backend/               # Backend API (Node.js + Express + MongoDB)
│   ├── src/
│   ├── app.js
│   ├── package.json
│   └── tests/             # Backend unit and integration tests
├── frontend/              # Frontend application (React)
│   ├── public/
│   ├── src/
│   ├── dist/             # Production build artifacts
│   ├── package.json
│   └── tests/             # Frontend unit tests
├── terraform/             # Terraform scripts for AWS infrastructure
│   ├── backend/           # Backend-specific Terraform configurations
│   ├── frontend/          # Frontend-specific Terraform configurations
│   ├── modules/           # Reusable Terraform modules
│   └── main.tf            # Main infrastructure definition
└── .github/workflows/     # CI/CD pipeline definitions
```

---

## **Features**

- **Frontend**:
  - Developed using React.
  - User-friendly interface for job seekers and employers.
  - Hosted on AWS S3.
  - Dynamically configured API URL via environment variables.

- **Backend**:
  - Built with Node.js and Express.
  - MongoDB as the database for storing job postings and user data.
  - Hosted on AWS ECS using Fargate for serverless containerization.
  - Secure authentication with JWT.

- **Infrastructure**:
  - Defined using Terraform.
  - AWS services used:
    - S3 (Frontend hosting)
    - ECS with Fargate (Backend hosting)
    - ALB (Load Balancer for backend)
    - ECR (Container Registry)
    - Route 53 (DNS management)
    - IAM (Secure access policies)
  - Terraform outputs dynamically update the application configuration.

- **CI/CD**:
  - GitHub Actions pipeline for:
    - Unit tests
    - Integration tests
    - Deployment of frontend and backend

---

## **Getting Started**

### **Prerequisites**
- Node.js >= 18.x
- NPM or Yarn
- Terraform >= 1.5.x
- AWS CLI configured with access keys
- MongoDB (Local or Atlas)

---

### **Local Development**

#### **1. Clone the Repository**
```bash
git clone https://github.com/nabid97/Tempo.git
cd Tempo
```

#### **2. Backend Setup**
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```plaintext
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>
   ```
4. Start the server:
   ```bash
   node server.js
   ```

#### **3. Frontend Setup**
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```plaintext
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run build
   ```

---

### **Deployment**

#### **1. Infrastructure Deployment**
1. Navigate to the `terraform` directory:
   ```bash
   cd terraform
   ```
2. Initialize Terraform:
   ```bash
   terraform init
   ```
3. Apply the Terraform configuration:
   ```bash
   terraform apply -auto-approve
   ```

#### **2. Update Frontend API URL**
The Terraform deployment outputs the ALB DNS name. Update the `REACT_APP_API_URL` in the `.env` file dynamically during deployment.

---

## **CI/CD Pipeline**

The CI/CD pipeline is defined in `.github/workflows`. It includes:
- **Frontend Tests**: Unit tests and build verification.
- **Backend Tests**: Unit and integration tests using MongoDB service.
- **Integration Tests**: Ensures end-to-end functionality.
- **Deployment**:
  - Backend to AWS ECS (Fargate).
  - Frontend to AWS S3.

Trigger the pipeline by pushing to the `main` branch.

---

## **Testing**

### **Backend Tests**
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run tests:
   ```bash
   npm test
   ```

### **Frontend Tests**
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Run tests:
   ```bash
   npm test
   ```

---

## **Environment Variables**

### **Backend**
| Key         | Description                          |
|-------------|--------------------------------------|
| `MONGO_URI` | MongoDB connection URI               |
| `JWT_SECRET`| Secret key for JWT authentication    |

### **Frontend**
| Key                  | Description                           |
|----------------------|---------------------------------------|
| `REACT_APP_API_URL`  | Backend API URL                      |

---

## **Contributing**

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## **License**
This project is licensed under the [MIT License](LICENSE).

---
