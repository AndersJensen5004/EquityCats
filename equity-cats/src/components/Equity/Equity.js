import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Equity.css';

const Equity = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/stock/${symbol}`);
        setStockData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching stock data');
        setLoading(false);
        console.error('Error details:', err);
      }
    };

    fetchStockData();
  }, [symbol]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stockData || !stockData.chart || !stockData.chart.result || stockData.chart.result.length === 0) {
    return <div className="error">No data available for {symbol}</div>;
  }

  const quote = stockData.chart.result[0].meta;
  const price = quote.regularMarketPrice;
  const change = quote.regularMarketChange;
  const changePercent = quote.regularMarketChangePercent;

  return (
    <div className="equity-container">
      <h2>{symbol} Stock Data</h2>
      <div className="stock-info">
        <p>Current Price: ${price?.toFixed(2) ?? 'N/A'}</p>
        <p className={change >= 0 ? 'positive' : 'negative'}>
          Change: ${change?.toFixed(2) ?? 'N/A'} ({changePercent?.toFixed(2) ?? 'N/A'}%)
        </p>
        <p>Previous Close: ${quote.previousClose?.toFixed(2) ?? 'N/A'}</p>
        <p>Open: ${quote.regularMarketOpen?.toFixed(2) ?? 'N/A'}</p>
        <p>Day's Range: ${quote.regularMarketDayLow?.toFixed(2) ?? 'N/A'} - ${quote.regularMarketDayHigh?.toFixed(2) ?? 'N/A'}</p>
      </div>
    </div>
  );
};

export default Equity;