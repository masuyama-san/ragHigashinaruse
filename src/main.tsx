import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Amplify } from 'aws-amplify'
import awsconfig from './aws-exports.ts'
import { BrowserRouter } from 'react-router-dom'

// Amplify設定を適用
console.log('Amplify設定を適用:', awsconfig);
Amplify.configure(awsconfig);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
