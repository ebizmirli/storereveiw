import React from 'react'
import ReactDOM from 'react-dom/client'
import AppAnalysis from './AppAnalysis.jsx' // Sizin ana dosyanız
import './index.css' // Tailwind stillerini yükler

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppAnalysis />
  </React.StrictMode>,
)