import React, { useRef, useEffect, useState, useCallback } from 'react';
import './CandlestickChart.css';

const CandlestickChart = ({ data, width = '100%', height = 400, margin = { top: 20, right: 30, bottom: 30, left: 60 } }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState({ x: 1 });
  const [offset, setOffset] = useState({ x: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height });
  const [hoverInfo, setHoverInfo] = useState(null);

  const updateCanvasSize = useCallback(() => {
    if (canvasRef.current) {
      const { offsetWidth } = canvasRef.current.parentElement;
      setCanvasSize({ width: offsetWidth, height });
    }
  }, [height]);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const xScale = (canvasSize.width - margin.left - margin.right) / (data.length - 1) * scale.x;
    const yMin = Math.min(...data.map(d => d.low));
    const yMax = Math.max(...data.map(d => d.high));
    const yRange = yMax - yMin;
    const yScale = (canvasSize.height - margin.top - margin.bottom) / yRange;

    // candlestick width 
    const candlestickWidth = Math.max(1, Math.min(60, xScale * 0.8));

    // grid lines
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (canvasSize.height - margin.top - margin.bottom) * (i / 5);
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(canvasSize.width - margin.right, y);
      ctx.stroke();
    }

    // candlesticks
    data.forEach((d, i) => {
      const x = margin.left + i * xScale + offset.x;
      const open = canvasSize.height - margin.bottom - (d.open - yMin) * yScale;
      const close = canvasSize.height - margin.bottom - (d.close - yMin) * yScale;
      const high = canvasSize.height - margin.bottom - (d.high - yMin) * yScale;
      const low = canvasSize.height - margin.bottom - (d.low - yMin) * yScale;

      ctx.beginPath();
      ctx.moveTo(x, high);
      ctx.lineTo(x, low);
      ctx.strokeStyle = d.close > d.open ? '#00FF00' : '#FF0000';
      ctx.stroke();

      ctx.fillStyle = d.close > d.open ? '#00FF00' : '#FF0000';
      ctx.fillRect(x - candlestickWidth / 2, Math.min(open, close), candlestickWidth, Math.abs(close - open));
    });

    // axes
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, canvasSize.height - margin.bottom);
    ctx.lineTo(canvasSize.width - margin.right, canvasSize.height - margin.bottom);
    ctx.stroke();

    // x-axis labels
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    data.forEach((d, i) => {
      if (i % Math.floor(data.length / 5) === 0) {
        const x = margin.left + i * xScale + offset.x;
        ctx.fillText(d.date, x, canvasSize.height - margin.bottom + 5);
      }
    });

    // y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
      const y = margin.top + (canvasSize.height - margin.top - margin.bottom) * (1 - i / 5);
      const value = yMin + (yRange * i) / 5;
      ctx.fillText(value.toFixed(2), margin.left - 5, y);
    }

    // hover info
    if (hoverInfo) {
      const { x, y, data: hoverData } = hoverInfo;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.strokeStyle = '#4a4a4a';
      ctx.lineWidth = 1;
      const boxWidth = 120;
      const boxHeight = 140;
      const boxX = Math.min(x + 10, canvasSize.width - boxWidth - 10);
      const boxY = Math.min(y - boxHeight - 10, canvasSize.height - boxHeight - 10);
      
      // box 
      ctx.beginPath();
      ctx.moveTo(boxX + 5, boxY);
      ctx.lineTo(boxX + boxWidth - 5, boxY);
      ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + 5);
      ctx.lineTo(boxX + boxWidth, boxY + boxHeight - 5);
      ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - 5, boxY + boxHeight);
      ctx.lineTo(boxX + 5, boxY + boxHeight);
      ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - 5);
      ctx.lineTo(boxX, boxY + 5);
      ctx.quadraticCurveTo(boxX, boxY, boxX + 5, boxY);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Data', boxX + 10, boxY + 20);
      
      ctx.font = '12px Arial';
      ctx.fillText(`Date: ${hoverData.date}`, boxX + 10, boxY + 40);
      ctx.fillText(`Open: ${hoverData.open.toFixed(2)}`, boxX + 10, boxY + 60);
      ctx.fillText(`High: ${hoverData.high.toFixed(2)}`, boxX + 10, boxY + 80);
      ctx.fillText(`Low: ${hoverData.low.toFixed(2)}`, boxX + 10, boxY + 100);
      ctx.fillText(`Close: ${hoverData.close.toFixed(2)}`, boxX + 10, boxY + 120);
    }
  }, [data, scale, offset, canvasSize, margin, hoverInfo]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prevScale => ({ x: prevScale.x * scaleChange }));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX });
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      setOffset(prevOffset => ({ x: prevOffset.x + dx }));
      setDragStart({ x: e.clientX });
    }

    const xScale = (canvasSize.width - margin.left - margin.right) / (data.length - 1) * scale.x;
    const index = Math.round((x - margin.left - offset.x) / xScale);
    if (index >= 0 && index < data.length) {
      setHoverInfo({ x, y, data: data[index] });
    } else {
      setHoverInfo(null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoverInfo(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isDragging ? 'grabbing' : 'grab', width: '100%', height: `${height}px` }}
    />
  );
};

export default CandlestickChart;