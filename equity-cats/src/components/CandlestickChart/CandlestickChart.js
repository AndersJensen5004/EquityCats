import React, { useRef, useEffect, useState } from 'react';
import './CandlestickChart.css';

const CandlestickChart = ({ data, width = 800, height = 400, margin = { top: 20, right: 30, bottom: 30, left: 40 } }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const drawChart = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, width, height);

    const xScale = (width - margin.left - margin.right) / (data.length - 1) * scale.x;
    const yMin = Math.min(...data.map(d => d.low));
    const yMax = Math.max(...data.map(d => d.high));
    const yRange = yMax - yMin;
    const yScale = (height - margin.top - margin.bottom) / yRange * scale.y;

    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (height - margin.top - margin.bottom) * (i / 5);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(width - margin.right, y);
      ctx.stroke();
    }

    data.forEach((d, i) => {
      const x = margin.left + i * xScale + offset.x;
      const open = height - margin.bottom - (d.open - yMin) * yScale + offset.y;
      const close = height - margin.bottom - (d.close - yMin) * yScale + offset.y;
      const high = height - margin.bottom - (d.high - yMin) * yScale + offset.y;
      const low = height - margin.bottom - (d.low - yMin) * yScale + offset.y;

      ctx.beginPath();
      ctx.moveTo(x, high);
      ctx.lineTo(x, low);
      ctx.strokeStyle = d.close > d.open ? 'green' : 'red';
      ctx.stroke();

      ctx.fillStyle = d.close > d.open ? 'green' : 'red';
      ctx.fillRect(x - 3, open, 6, close - open);
    });

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, height - margin.bottom);
    ctx.lineTo(width - margin.right, height - margin.bottom);
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    data.forEach((d, i) => {
      if (i % Math.floor(data.length / 5) === 0) {
        const x = margin.left + i * xScale + offset.x;
        ctx.fillText(d.date, x, height - margin.bottom + 5);
      }
    });

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (height - margin.top - margin.bottom) * (1 - i / 5);
      const value = yMin + (yRange * i) / 5;
      ctx.fillText(value.toFixed(2), margin.left - 5, y);
    }
  };

  useEffect(() => {
    drawChart();
  }, [data, scale, offset]);

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prevScale => ({ x: prevScale.x * scaleChange, y: prevScale.y}));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setOffset(prevOffset => ({ x: prevOffset.x + dx, y: prevOffset.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    />
  );
};

export default CandlestickChart;