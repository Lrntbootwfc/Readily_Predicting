MaintenaSense: An Interactive Predictive Maintenance Prototype

Welcome to the MaintenaSense project repository. This project demonstrates a full-stack, AI-powered predictive maintenance platform designed to help industries detect potential equipment failures before they occur.

Instead of a conventional presentation, I chose a more dynamic and interactive approach to showcase this project's capabilities. I developed a functional web application as a live, tangible prototype of the MaintenaSense platform. This decision was deliberate, as it allowed me to seamlessly integrate a Python backend (Flask) with a responsive React frontend.

This approach not only highlights my proficiency in full-stack web development but also provides a far more compelling and engaging experience for the audience. By building a live application, I was able to showcase real-time data visualization and live model predictions, offering an authentic and immersive look at how the system functions from end to end. This innovative method serves as a testament to my commitment to creating practical, scalable, and fully functional solutions.

Key Features

    Predictive Modeling: Utilizes a Random Forest classifier to predict equipment failure based on sensor data (temperature, vibration, pressure).

    Interactive Dashboard: Provides a dynamic, real-time interface to visualize key performance indicators (KPIs) and model metrics.

    Live Prediction Demo: Allows users to input new sensor data and get an instant prediction from the trained model.

    Robust Backend: A Flask API handles data processing, model training, and prediction requests.

    Modern Frontend: A React-based interface ensures a responsive and intuitive user experience.

Project Structure

├── backend/
│   ├── app.py              # Flask API for model training and prediction
│   └── data/               # Placeholder for dataset (if needed)
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   └── index.css       # Styling
│   └── public/
├── README.md               # Project overview and instructions
└── requirements.txt        # Python dependencies

How to Run the Project

    Clone the repository:
    Bash

git clone [repository URL]
cd [repository folder]

Set up the backend:
Bash

cd backend
pip install -r requirements.txt
python app.py

Set up the frontend:
Bash

    cd ../frontend
    npm install
    npm start

The application should now be running and accessible in your web browser.
