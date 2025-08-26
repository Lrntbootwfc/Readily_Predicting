import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import {
  Sparkles, FlaskConical, GaugeCircle, Wrench, Sprout, Shield, HardHat, Cog
} from 'lucide-react';
import Chart from 'chart.js/auto';
import './App.css';
// This is a self-contained, front-end only version of the app.
// All backend API calls have been removed and replaced with hardcoded data and simulated logic.

const App = () => {
  // State variables for the application
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [inputData, setInputData] = useState({ temperature: '', vibration: '', pressure: '' });
  const [metrics, setMetrics] = useState({
    total_machines: 150,
    failed_machines_historical: 25
  });
  // Hardcoded model metrics to simulate a trained model
  const [modelMetrics, setModelMetrics] = useState({
    true_positives: 50,
    true_negatives: 400,
    false_positives: 5,
    false_negatives: 10
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  // Refs for Chart.js canvas elements
  const uptimeChartRef = useRef(null);
  const failureTypesChartRef = useRef(null);
  const probabilityChartRef = useRef(null);
  const uptimeChartInstance = useRef(null);
  const failureTypesChartInstance = useRef(null);
  const probabilityChartInstance = useRef(null);

  // Data for the presentation slides
  const slides = [
    { id: 'overview', title: 'Project Overview', icon: <Sparkles className="w-8 h-8 text-[#94d2bd]" /> },
    { id: 'problem', title: 'Problem Statement', icon: <Wrench className="w-8 h-8 text-[#ee9b00]" /> },
    { id: 'solution', title: 'Proposed Solution', icon: <Shield className="w-8 h-8 text-[#0a9396]" /> },
    { id: 'architecture', title: 'Data Architecture', icon: <Cog className="w-8 h-8 text-[#ca6702]" /> },
    { id: 'model', title: 'Predictive Model', icon: <FlaskConical className="w-8 h-8 text-[#94d2bd]" /> },
    { id: 'dashboard', title: 'KPI Dashboard', icon: <GaugeCircle className="w-8 h-8 text-[#e9d8a6]" /> },
    { id: 'cybersecurity', title: 'Cybersecurity', icon: <Shield className="w-8 h-8 text-[#0a9396]" /> },
    { id: 'future', title: 'Future Improvements', icon: <Sprout className="w-8 h-8 text-[#005f73]" /> },
  ];

  // Function to simulate a prediction without a backend
  const handlePredict = (e) => {
    e.preventDefault();
    setLoading(true);
    setPredictionResult(null);
    setErrorMessage('');

    // Simulate an API call with a delay
    setTimeout(() => {
      // Simple hardcoded logic to simulate a prediction
      const { temperature, vibration, pressure } = inputData;
      let prediction = 0;
      let probability = 0.10;

      // Logic to determine a 'failure' based on input values
      if (parseFloat(temperature) > 90 || parseFloat(vibration) > 20 || parseFloat(pressure) > 750) {
        prediction = 1;
        probability = 0.95;
      }

      setPredictionResult({ prediction, probability });
      setLoading(false);
    }, 1000); // Simulate a 1 second loading time
  };

  // Effect for initializing Chart.js charts
  useEffect(() => {
    const wrapLabel = (label, maxWidth) => {
      if (label.length <= maxWidth) {
        return label;
      }
      const words = label.split(' ');
      const lines = [];
      let currentLine = '';
      for (const word of words) {
        if ((currentLine + word).length > maxWidth) {
          lines.push(currentLine.trim());
          currentLine = '';
        }
        currentLine += word + ' ';
      }
      lines.push(currentLine.trim());
      return lines;
    };

    const tooltipTitleCallback = (tooltipItems) => {
      const item = tooltipItems[0];
      let label = item.chart.data.labels[item.dataIndex];
      if (Array.isArray(label)) {
        return label.join(' ');
      } else {
        return label;
      }
    };

    // Dark mode chart options
    const chartJsOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#cbd5e1', // Slate 300
            font: { family: 'Inter, sans-serif' }
          }
        },
        tooltip: {
          callbacks: {
            title: tooltipTitleCallback
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#94a3b8', font: { family: 'Inter, sans-serif' } }, // Slate 400
          grid: { color: '#334155' } // Slate 700
        },
        x: {
          ticks: { color: '#94a3b8', font: { family: 'Inter, sans-serif' } }, // Slate 400
          grid: { display: false }
        }
      }
    };

    // Uptime Chart (Doughnut)
    if (uptimeChartRef.current) {
      if (uptimeChartInstance.current) { uptimeChartInstance.current.destroy(); }
      uptimeChartInstance.current = new Chart(uptimeChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Uptime', 'Downtime'],
          datasets: [{
            label: 'Operational Uptime',
            data: [91, 9], // Hardcoded values
            backgroundColor: ['#0a9396', '#e9d8a6'],
            borderColor: ['#1e293b', '#1e293b'], // Slate 800
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#cbd5e1', font: { family: 'Inter, sans-serif' } } },
            tooltip: { callbacks: { title: tooltipTitleCallback } }
          }
        }
      });
    }

    // Failure Types Chart (Bar)
    if (failureTypesChartRef.current) {
      if (failureTypesChartInstance.current) { failureTypesChartInstance.current.destroy(); }
      const failureLabels = ['Vibration Anomaly', 'Component Overheating', 'Pressure Drop', 'Bearing Wear', 'Software Glitch'].map(label => wrapLabel(label, 16));
      failureTypesChartInstance.current = new Chart(failureTypesChartRef.current, {
        type: 'bar',
        data: {
          labels: failureLabels,
          datasets: [{
            label: 'Predicted Incidents (Last 30 Days)',
            data: [45, 38, 25, 21, 15], // Hardcoded values
            backgroundColor: ['#0a9396', '#94d2bd', '#e9d8a6', '#ee9b00', '#ca6702'],
            borderColor: '#1e293b', // Slate 800
            borderWidth: 1
          }]
        },
        options: chartJsOptions
      });
    }

    // Probability Chart (Scatter)
    if (probabilityChartRef.current) {
      if (probabilityChartInstance.current) { probabilityChartInstance.current.destroy(); }
      const scatterData = Array.from({ length: 50 }, () => ({
        x: Math.random() * 2000,
        y: Math.random()
      })).map(p => ({ x: p.x, y: p.y * (p.x / 2000) * 0.8 + Math.random() * 0.2 })).sort((a, b) => a.x - b.x);
      probabilityChartInstance.current = new Chart(probabilityChartRef.current, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Machine Data Points',
            data: scatterData,
            backgroundColor: '#ae2012'
          }]
        },
        options: {
          ...chartJsOptions,
          scales: {
            y: {
              ...chartJsOptions.scales.y,
              title: { display: true, text: 'Failure Probability', color: '#94a3b8', font: { family: 'Inter, sans-serif' } }
            },
            x: {
              ...chartJsOptions.scales.x,
              title: { display: true, text: 'Operating Hours', color: '#94a3b8', font: { family: 'Inter, sans-serif' } }
            }
          }
        }
      });
    }

    // Cleanup function to destroy chart instances on unmount
    return () => {
      if (uptimeChartInstance.current) { uptimeChartInstance.current.destroy(); }
      if (failureTypesChartInstance.current) { uptimeChartInstance.current.destroy(); }
      if (probabilityChartInstance.current) { probabilityChartInstance.current.destroy(); }
    };
  }, [activeSlide]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const confusionData = modelMetrics ? [
    { name: 'True Positives', value: modelMetrics.true_positives, color: '#0a9396' },
    { name: 'True Negatives', value: modelMetrics.true_negatives, color: '#94d2bd' },
    { name: 'False Positives', value: modelMetrics.false_positives, color: '#e9d8a6' },
    { name: 'False Negatives', value: modelMetrics.false_negatives, color: '#ee9b00' },
  ] : [];

  const renderSlide = (slideId) => {
    switch (slideId) {
      case 'overview':
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-screen p-8 transition-opacity duration-700 ease-in-out">
            <h1 className="text-6xl font-extrabold text-[#94d2bd] mb-6 animate-pulse">MAINTENASENSE</h1>
            <p className="text-2xl text-gray-300 mb-8 max-w-2xl">AI-Powered Predictive Maintenance Platform</p>
            <p className="text-xl max-w-3xl text-gray-400">
              This project enhances manufacturing operations using advanced data analytics. By integrating technologies like edge computing and blockchain, the project improves efficiency and reduces operational bottlenecks.
            </p>
          </div>
        );
      case 'problem':
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-screen p-8 transition-opacity duration-700 ease-in-out">
            <h2 className="text-5xl font-bold text-[#94d2bd] mb-8">Problem Statement</h2>
            <p className="max-w-4xl mx-auto text-xl text-gray-400 mb-12">
              Manufacturing firms struggle to collect and analyze data effectively, leading to inefficiencies, costly downtime, and low ROI on machinery. This reactive approach is inefficient and unreliable.
            </p>
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-10 border-t-8 border-[#ee9b00] transform hover:scale-105 transition-transform duration-300">
              <p className="text-8xl font-black text-[#ca6702]">42%</p>
              <p className="text-2xl font-semibold text-gray-200 mt-4">of equipment failures are preventable.</p>
            </div>
          </div>
        );
      case 'solution':
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-screen p-8 transition-opacity duration-700 ease-in-out">
            <h2 className="text-5xl font-bold text-[#94d2bd] mb-8">Proposed Solution with Use Case</h2>
            <p className="max-w-4xl mx-auto text-xl text-gray-400 mb-12">
              Our project provides a comprehensive data analytics framework for manufacturing, using real-time operational data to predict potential machine failures before they occur.
            </p>
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-10 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-3xl font-bold text-[#0a9396] mb-6">Use Case: A Manufacturing Plant</h3>
              <p className="text-gray-400 mb-8 text-lg">
                By implementing our predictive maintenance solution, a manufacturing plant can shift from a reactive to a proactive strategy.
              </p>
              <div className="text-center">
                <p className="text-gray-500 text-base">A proven use case shows a</p>
                <p className="text-8xl font-black text-[#0a9396]">30%</p>
                <p className="text-3xl font-bold text-gray-200 mt-2">Reduction in Machine Downtime</p>
              </div>
            </div>
          </div>
        );
      case 'architecture':
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-screen p-8 transition-opacity duration-700 ease-in-out">
            <h2 className="text-5xl font-bold text-[#94d2bd] mb-12">Data Lake Architecture Diagram</h2>
            <p className="max-w-5xl mx-auto text-xl text-center text-gray-400 mb-16">
              The system is built on a modern data lake architecture, ensuring a scalable and flexible flow of information from the factory floor to actionable insights.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center flex-wrap">
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-72 h-40 flex flex-col items-center justify-center border-t-4 border-[#ca6702] transform hover:scale-105 transition-transform duration-300">
                <Wrench className="w-12 h-12 text-[#ca6702] mb-2" />
                <p className="font-semibold text-gray-200 text-lg">Sensors & Data Collection</p>
                <p className="text-sm text-gray-400">IoT devices, Operational systems</p>
              </div>
              <div className="flex-shrink-0 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 rotate-90 md:rotate-0 animate-pulse-arrow">
                  <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-72 h-40 flex flex-col items-center justify-center border-t-4 border-[#94d2bd] transform hover:scale-105 transition-transform duration-300">
                <Shield className="w-12 h-12 text-[#94d2bd] mb-2" />
                <p className="font-semibold text-gray-200 text-lg">Secure Data Lake</p>
                <p className="text-sm text-gray-400">Centralized storage, Scalable</p>
              </div>
              <div className="flex-shrink-0 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 rotate-90 md:rotate-0 animate-pulse-arrow">
                  <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-72 h-40 flex flex-col items-center justify-center border-t-4 border-[#e9d8a6] transform hover:scale-105 transition-transform duration-300">
                <FlaskConical className="w-12 h-12 text-[#e9d8a6] mb-2" />
                <p className="font-semibold text-gray-200 text-lg">Predictive Analytics</p>
                <p className="text-sm text-gray-400">Machine learning models, Insights</p>
              </div>
              <div className="flex-shrink-0 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 rotate-90 md:rotate-0 animate-pulse-arrow">
                  <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-72 h-40 flex flex-col items-center justify-center border-t-4 border-[#0a9396] transform hover:scale-105 transition-transform duration-300">
                <Sprout className="w-12 h-12 text-[#0a9396] mb-2" />
                <p className="font-semibold text-gray-200 text-lg">Actionable Insights</p>
                <p className="text-sm text-gray-400">Real-time dashboard, Reporting</p>
              </div>
            </div>
          </div>
        );
      case 'model':
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-screen p-8 transition-opacity duration-700 ease-in-out">
            <h2 className="text-5xl font-bold text-[#94d2bd] mb-8">Predictive Model Outcomes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border-t-4 border-[#94d2bd]">
                <h3 className="text-2xl font-semibold text-center text-gray-200 mb-6">Model Accuracy and Recall</h3>
                <p className="text-xl text-gray-400 mb-6">
                  Our model achieves a **99% accuracy** in identifying machine states and a **55% recall rate** for failure detection.
                </p>
                <div className="chart-container h-80 w-full">
                  <canvas id="uptimeChart" ref={uptimeChartRef}></canvas>
                </div>
              </div>
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border-t-4 border-[#ae2012]">
                <h3 className="text-2xl font-semibold text-center text-gray-200 mb-6">Failure Probability vs. Operating Hours</h3>
                <div className="chart-container h-80 w-full">
                  <canvas id="probabilityChart" ref={probabilityChartRef}></canvas>
                </div>
              </div>
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="p-8 flex flex-col items-center min-h-screen transition-opacity duration-700 ease-in-out">
            <h2 className="text-5xl font-bold text-[#94d2bd] mb-8">KPI Dashboard & Live Demo</h2>
            <p className="text-xl max-w-4xl text-gray-400 mb-12 text-center">
              The interactive dashboard gives you a clear view of key performance indicators and a live demonstration of the prediction engine.
            </p>
            <div className="bg-slate-800 rounded-2xl shadow-2xl p-10 w-full max-w-3xl border-t-4 border-[#0a9396]">
              <h3 className="text-3xl font-bold text-gray-200 mb-6 text-center">Live Prediction Demo</h3>
              <form onSubmit={handlePredict} className="space-y-8">
                <div>
                  <label htmlFor="temperature" className="block text-lg font-medium text-gray-400">Temperature (°C)</label>
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    value={inputData.temperature}
                    onChange={handleInputChange}
                    className="mt-2 block w-full rounded-lg border-gray-600 bg-slate-700 text-white shadow-sm focus:border-[#0a9396] focus:ring focus:ring-[#0a9396] focus:ring-opacity-50 transition-colors duration-200 p-3"
                    placeholder="e.g., 95.2"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="vibration" className="block text-lg font-medium text-gray-400">Vibration (mm/s)</label>
                  <input
                    type="number"
                    id="vibration"
                    name="vibration"
                    value={inputData.vibration}
                    onChange={handleInputChange}
                    className="mt-2 block w-full rounded-lg border-gray-600 bg-slate-700 text-white shadow-sm focus:border-[#0a9396] focus:ring focus:ring-[#0a9396] focus:ring-opacity-50 transition-colors duration-200 p-3"
                    placeholder="e.g., 18.5"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="pressure" className="block text-lg font-medium text-gray-400">Pressure (kPa)</label>
                  <input
                    type="number"
                    id="pressure"
                    name="pressure"
                    value={inputData.pressure}
                    onChange={handleInputChange}
                    className="mt-2 block w-full rounded-lg border-gray-600 bg-slate-700 text-white shadow-sm focus:border-[#0a9396] focus:ring focus:ring-[#0a9396] focus:ring-opacity-50 transition-colors duration-200 p-3"
                    placeholder="e.g., 720"
                    step="1"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-4 px-8 border border-transparent rounded-full shadow-lg text-lg font-medium text-white bg-[#0a9396] hover:bg-[#005f73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a9396] transition-colors duration-300 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <svg className="animate-spin h-6 w-6 text-white mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Predict Failure'
                  )}
                </button>
              </form>
              {predictionResult && (
                <div className="mt-10 p-8 rounded-xl bg-slate-900 border border-slate-700 transform animate-fade-in-up">
                  <h3 className="text-2xl font-bold text-gray-200 mb-4">Prediction Result</h3>
                  <p className="text-xl text-gray-300">
                    <span className="font-semibold">Prediction:</span> {' '}
                    <span className={`font-bold ${predictionResult.prediction === 1 ? 'text-[#ae2012]' : 'text-[#94d2bd]'}`}>
                      {predictionResult.prediction === 1 ? 'Failure Predicted' : 'No Failure Predicted'}
                    </span>
                  </p>
                  <p className="text-base text-gray-400 mt-4">
                    <span className="font-semibold">Probability:</span> {Math.round(predictionResult.probability * 100)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case 'cybersecurity':
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-screen p-8 transition-opacity duration-700 ease-in-out">
            <h2 className="text-5xl font-bold text-[#94d2bd] mb-8">Cybersecurity Strategy</h2>
            <p className="max-w-4xl mx-auto text-xl text-gray-400 mb-12">
              A comprehensive cybersecurity plan ensures the integrity and confidentiality of sensitive operational data throughout the data lifecycle.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left w-full max-w-6xl">
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-[#94d2bd]">
                <Shield className="w-16 h-16 text-[#94d2bd] mb-4" />
                <h3 className="text-xl font-bold text-gray-200 mb-2">Secure Ingestion</h3>
                <p className="text-gray-400 text-center text-base">Encrypt data in transit from sensors to prevent interception.</p>
              </div>
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-[#ee9b00]">
                <HardHat className="w-16 h-16 text-[#ee9b00] mb-4" />
                <h3 className="text-xl font-bold text-gray-200 mb-2">Access Control</h3>
                <p className="text-gray-400 text-center text-base">Implement role-based access to limit data views to authorized personnel.</p>
              </div>
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-[#ca6702]">
                <Cog className="w-16 h-16 text-[#ca6702] mb-4" />
                <h3 className="text-xl font-bold text-gray-200 mb-2">Data Masking</h3>
                <p className="text-gray-400 text-center text-base">Anonymize or mask sensitive data to protect privacy and proprietary information.</p>
              </div>
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-[#ae2012]">
                <Wrench className="w-16 h-16 text-[#ae2012] mb-4" />
                <h3 className="text-xl font-bold text-gray-200 mb-2">Continuous Monitoring</h3>
                <p className="text-gray-400 text-center text-base">Actively monitor logs and network traffic for suspicious activities.</p>
              </div>
            </div>
          </div>
        );
      case 'future':
        return (
          <div className="flex flex-col items-center justify-center text-center min-h-screen p-8 transition-opacity duration-700 ease-in-out">
            <h2 className="text-5xl font-bold text-[#94d2bd] mb-8">Future Improvements</h2>
            <p className="max-w-4xl mx-auto text-xl text-gray-400 mb-12">
              Our project is a foundation for further innovation in manufacturing analytics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left w-full max-w-6xl">
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 flex items-start gap-6 transform hover:scale-105 transition-transform duration-300 border-l-4 border-[#0a9396]">
                <div className="p-4 bg-[#0a9396]/10 rounded-full">
                  <HardHat className="w-10 h-10 text-[#0a9396]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-200 mb-2">Edge Computing & IoT Integration</h3>
                  <p className="text-gray-400 text-lg">Deploying our models directly on edge devices to enable real-time predictions at the source of the data.</p>
                </div>
              </div>
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 flex items-start gap-6 transform hover:scale-105 transition-transform duration-300 border-l-4 border-[#ee9b00]">
                <div className="p-4 bg-[#ee9b00]/10 rounded-full">
                  <Shield className="w-10 h-10 text-[#ee9b00]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-200 mb-2">Blockchain for Data Integrity</h3>
                  <p className="text-gray-400 text-lg">Using blockchain to create an immutable ledger for operational data, ensuring trust and traceability.</p>
                </div>
              </div>
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 flex items-start gap-6 transform hover:scale-105 transition-transform duration-300 border-l-4 border-[#94d2bd]">
                <div className="p-4 bg-[#94d2bd]/10 rounded-full">
                  <FlaskConical className="w-10 h-10 text-[#94d2bd]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-200 mb-2">Advanced Time-Series Models</h3>
                  <p className="text-gray-400 text-lg">Exploring more advanced models like LSTMs to capture complex time-based relationships in the data.</p>
                </div>
              </div>
              <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 flex items-start gap-6 transform hover:scale-105 transition-transform duration-300 border-l-4 border-[#ca6702]">
                <div className="p-4 bg-[#ca6702]/10 rounded-full">
                  <Sprout className="w-10 h-10 text-[#ca6702]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-200 mb-2">Automated Alerting</h3>
                  <p className="text-gray-400 text-lg">Implementing an automated notification system to alert maintenance teams via email or SMS of high-priority failures.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-sans min-h-screen bg-slate-950 text-slate-100 overflow-hidden relative">
      <style>
        {`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-pulse-arrow {
          animation: pulseArrow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulseArrow {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(90deg);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8) rotate(90deg);
          }
        }

        @media (min-width: 768px) {
          .animate-pulse-arrow {
            animation-name: pulseArrow-md;
          }
          @keyframes pulseArrow-md {
            0%, 100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 0.5;
              transform: scale(0.8) rotate(0deg);
            }
          }
        }
        `}
      </style>
      <div className="flex justify-between items-center bg-gray-900 text-white py-4 px-8 shadow-2xl fixed top-0 left-0 right-0 z-50">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="w-10 h-10 text-[#94d2bd]" />
          MaintenaSense
        </h1>
        <div className="flex gap-4">
          {activeSlide > 0 && (
            <button
              onClick={() => setActiveSlide(prev => prev - 1)}
              className="px-6 py-2 rounded-full font-medium text-lg transition-all duration-300 bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white transform hover:scale-105"
            >
              Previous
            </button>
          )}
          {activeSlide < slides.length - 1 ? (
            <button
              onClick={() => setActiveSlide(prev => prev + 1)}
              className="px-6 py-2 rounded-full font-medium text-lg transition-all duration-300 bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white transform hover:scale-105"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setActiveSlide(0)}
              className="px-6 py-2 rounded-full font-medium text-lg transition-all duration-300 bg-[#94d2bd] text-gray-900 hover:bg-[#0a9396] transform hover:scale-105"
            >
              Restart
            </button>
          )}
        </div>
      </div>
      <div className="pt-24 min-h-screen">
        {renderSlide(slides[activeSlide].id)}
      </div>
      {/* Footer / Slide indicator */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-4 px-8 text-center text-sm shadow-inner">
        <p className="text-base font-semibold">Slide {activeSlide + 1} of {slides.length}: {slides[activeSlide].title}</p>
      </footer>
      {errorMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-900 border border-red-700 text-red-300 px-6 py-4 rounded-xl relative z-50 shadow-2xl">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
