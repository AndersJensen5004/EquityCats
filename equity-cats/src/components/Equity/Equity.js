import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useFetch from '../../Hooks/useFetch.js';
import './Equity.css';

const Equity = ({ symbol }) => {
  const { data: stockData, loading, error } = useFetch(`/api/stock/${symbol}`);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stockData) return <div className="error">No data available for {symbol}</div>;

  const quote = stockData.chart?.result[0]?.meta;
  const indicators = stockData.chart?.result[0]?.indicators?.quote[0];
  const timestamps = stockData.chart?.result[0]?.timestamp;

  if (!quote || !indicators || !timestamps) return <div className="error">Invalid data format for {symbol}</div>;

  const formatNumber = (num) => num?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? 'N/A';
  const formatVolume = (vol) => vol?.toLocaleString() ?? 'N/A';
  const formatDate = (timestamp) => new Date(timestamp * 1000).toLocaleTimeString();

  const chartData = timestamps.map((time, index) => ({
    time: formatDate(time),
    price: indicators.close[index],
  })).filter(item => item.price !== null);

  return (
    <div className="equity-container financial-terminal">
      <div className="header">
        <h2>{quote.longName} ({symbol})</h2>
        <p>{quote.fullExchangeName} - {quote.currency}</p>
      </div>
      <div className="grid-container">
        <div className="grid-item">
          <h3>Price</h3>
          <p className="large-number">{formatNumber(quote.regularMarketPrice)}</p>
        </div>
        <div className="grid-item">
          <h3>Change</h3>
          <p className={`large-number ${quote.regularMarketChange >= 0 ? 'positive' : 'negative'}`}>
            {formatNumber(quote.regularMarketChange)} ({formatNumber(quote.regularMarketChangePercent)}%)
          </p>
        </div>
        <div className="grid-item">
          <h3>Volume</h3>
          <p>{formatVolume(quote.regularMarketVolume)}</p>
        </div>
        <div className="grid-item">
          <h3>Avg. Volume</h3>
          <p>{formatVolume(quote.averageDailyVolume3Month)}</p>
        </div>
        <div className="grid-item">
          <h3>Previous Close</h3>
          <p>{formatNumber(quote.chartPreviousClose)}</p>
        </div>
        <div className="grid-item">
          <h3>Open</h3>
          <p>{formatNumber(quote.regularMarketOpen)}</p>
        </div>
        <div className="grid-item">
          <h3>Day Range</h3>
          <p>{formatNumber(quote.regularMarketDayLow)} - {formatNumber(quote.regularMarketDayHigh)}</p>
        </div>
        <div className="grid-item">
          <h3>52 Week Range</h3>
          <p>{formatNumber(quote.fiftyTwoWeekLow)} - {formatNumber(quote.fiftyTwoWeekHigh)}</p>
        </div>
        <div className="grid-item">
          <h3>Market Cap</h3>
          <p>{formatVolume(quote.marketCap)}</p>
        </div>
        <div className="grid-item">
          <h3>First Trade Date</h3>
          <p>{new Date(quote.firstTradeDate * 1000).toLocaleDateString()}</p>
        </div>
        <div className="grid-item">
          <h3>Timezone</h3>
          <p>{quote.exchangeTimezoneName}</p>
        </div>
        <div className="grid-item">
          <h3>Instrument Type</h3>
          <p>{quote.instrumentType}</p>
        </div>
      </div>
      <div className="chart-container">
        <h3>Price Chart</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Equity;