import React, {useState} from 'react'
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    Brush, 
} from 'recharts' 
import chartData from '../chartData.json'
import moment from 'moment'

import './index.css'

const ChartComponent = () => {
    const [timeframe, setTimeframe] = useState('daily')

    const groupDataByTimeframe = () => {
        switch (timeframe) {
          case 'daily':
            return chartData;
          case 'weekly':
            return groupDataByWeek(chartData);
          case 'monthly':
            return groupDataByMonth(chartData);
          default:
            return chartData;
        }
      }
    
      const groupDataByWeek = (data) => {
        const sortedData = [...data].sort((a, b) => moment(a.timestamp).valueOf() - moment(b.timestamp).valueOf())
      
        let groupedData = []
        let currentWeekStart = null
        let currentWeekData = []
      
        sortedData.forEach(point => {
          const timestamp = moment(point.timestamp)
      
          if (!currentWeekStart || timestamp.isSameOrAfter(currentWeekStart, 'week')) {
            currentWeekStart = timestamp.startOf('week') 
            if (currentWeekData.length > 0) {
              groupedData.push({
                timestamp: currentWeekStart.format('YYYY-MM-DD'),
                value: calculateAverageValue(currentWeekData) 
              })
            }
      
            currentWeekData = [point]
          } else {
            currentWeekData.push(point)
          }
        });
      
        if (currentWeekData.length > 0) {
          groupedData.push({
            timestamp: currentWeekStart.format('YYYY-MM-DD'),
            value: calculateAverageValue(currentWeekData) 
          })
        }
        return groupedData
      };

      const groupDataByMonth = (data) => {
        const sortedData = [...data].sort((a, b) => moment(a.timestamp).valueOf() - moment(b.timestamp).valueOf())
      
        let groupedData = []
        let currentMonthStart = null
        let currentMonthData = []
      
        sortedData.forEach(point => {
          const timestamp = moment(point.timestamp)
      
          if (!currentMonthStart || timestamp.isSameOrAfter(currentMonthStart, 'month')) {
            currentMonthStart = timestamp.startOf('month')
      
            if (currentMonthData.length > 0) {
              groupedData.push({
                timestamp: currentMonthStart.format('YYYY-MM'),
                value: calculateAverageValue(currentMonthData) 
              })
            }
      
            currentMonthData = [point];
          } else {
            currentMonthData.push(point);
          }
        })
      
        if (currentMonthData.length > 0) {
          groupedData.push({
            timestamp: currentMonthStart.format('YYYY-MM'),
            value: calculateAverageValue(currentMonthData)
          })
        }
        return groupedData;
      };
      
      
      const calculateAverageValue = (data) => {
        const sum = data.reduce((acc, point) => acc + point.value, 0);
        return sum / data.length;
      };
      
      
    const formattedData = groupDataByTimeframe().map(point => ({
        timestamp: moment(point.timestamp).format('YYYY-MM-DD'),
        value: point.value,
        additionalInfo: point.additionalInfo
      }))

      const handleTimeframeChange = (e) => {
        setTimeframe(e.target.value);
      }


    return (
        <div>
            <div className='time-frame-container'>
                <label className='time-frame-label'>
                  Select Timeframe:
                </label> 
                <select className='time-frame' value={timeframe} onChange={handleTimeframeChange}>
                    <option className='time-frame-option' value="daily">Daily</option>
                    <option className='time-frame-option' value="weekly">Weekly</option>
                    <option className='time-frame-option' value="monthly">Monthly</option>
                </select>   
            </div>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp"  tick={{ fontSize: 10, fill: '#700270', fontWeight: 'bold'}} />
                <YAxis tick={{ fontSize: 12, fill: '#700270', fontWeight: 'bold' }} />
                <Tooltip labelFormatter={(value) => moment(value).format('MMM DD, YYYY')} />
                <Legend
                    wrapperStyle={{ fontSize: '17px', fontWeight: 'bold', marginTop: '50px' }}
                    iconSize={18}
                />
                <Line type="monotone" dataKey="value" stroke="#700270" activeDot={{ r: 8 }} />
                <Brush dataKey="timestamp" height={30} stroke="#700270" />
              </LineChart>
            </ResponsiveContainer>
        </div>
    )
  }

  
  
  export default ChartComponent