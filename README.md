# Rewaste Backend API

This repository contains the backend API for the Rewaste project. Rewaste is an innovative application that addresses the issue of waste management by utilizing cloud computing technology.

## Features

- Deployed on Google Cloud Platform using Cloud Run for scalability.
- Built with Node.js and Express framework.
- Utilizes Google Cloud services such as Cloud SQL and Cloud Storage.
- Implements a machine learning model for waste classification.
- Provides CRUD operations for handicraft items.

## Prerequisites

Before running the project locally or deploying it, make sure you have the following prerequisites installed:

- Node.js (v12 or above)
- npm package manager
- Google Cloud Platform account with enabled services:
  - Cloud Run
  - Cloud SQL
  - Cloud Storage

## Getting Started

Follow the steps below to get the backend API up and running:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/rajastra/rewaste-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd rewaste-api
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Set up the environment variables by creating a .env file in the root directory. Use the .env.example file as a template and provide the necessary values.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. The API should now be accessible at <http://localhost:3000>.

## Deployment

To deploy the API on Google Cloud Platform, follow these steps:

1. Make sure you have the necessary credentials and authentication set up for Google Cloud Platform.
2. Update the project configuration in the app.yaml file.
3. Build the Docker image:

   ```bash
   npm run build
   ```

4. Deploy the Docker image to Cloud Run:

   ```bash
   gcloud run deploy --image gcr.io/[PROJECT_ID]/[IMAGE_NAME]
   ```

   Replace [PROJECT_ID] with your Google Cloud project ID and [IMAGE_NAME] with the desired name for the image.

5. Once deployed, the API will be accessible at the provided Cloud Run URL.
