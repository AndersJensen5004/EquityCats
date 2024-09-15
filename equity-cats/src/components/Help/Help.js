import React from 'react';
import './Help.css';

const Help = () => {
  return (
    <div className="help-container">
      <h2>Available Commands</h2>
      <ul>
        <li><strong>HELP</strong>: Display this help message</li>
        <li><strong>CLEAR</strong>: Clear the terminal screen</li>
        {/* Add more */}
      </ul>
    </div>
  );
};

export default Help;