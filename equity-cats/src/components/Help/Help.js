import React from 'react';
import './Help.css';

const Help = () => {
  return (
    <div className="help-container">
      <h2>Available Commands</h2>
      <ul>
        <li><strong>HELP &lt;GO&gt;</strong>: Display this help message</li>
        <li><strong>CLEAR &lt;GO&gt;</strong>: Clear the terminal screen</li>
        <li><strong>EQUITY &lt;SYMBOL&gt; &lt;GO&gt;</strong>: Loads an equity and displays general info</li>
        {/* Add more */}
      </ul>
    </div>
  );
};

export default Help;