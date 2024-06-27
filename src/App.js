import React from 'react'
import ChartComponent from './components/ChartComponent'
import './App.css'

const App = () => (
  <div className='app-container'>
    <h1 className='app-heading'>My Chart App</h1>
    <div className='chart-container'>
      <ChartComponent />
    </div>
  </div>
)

export default App