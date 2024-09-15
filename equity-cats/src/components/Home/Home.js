import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import Help from '../Help/Help.js';
import Equity from '../Equity/Equity.js';

const Home = () => {
    const [input, setInput] = useState('');
    const [currentComponent, setCurrentComponent] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            processCommand(input.trim().toUpperCase());
            setInput('');
        }
    };

    const processCommand = (command) => {
        const [action, param] = command.split(' ');
        switch (action) {
            case 'HELP':
                setCurrentComponent(<Help />);
                break;
            case 'CLEAR':
                setCurrentComponent(null);
                break;
            case 'EQUITY':
                if (param) {
                    setCurrentComponent(<Equity symbol={param} />);
                } else {
                    setCurrentComponent(<div className="unknown-command">Please provide a stock symbol. Example: EQUITY AAPL</div>);
                }
                break;
            default:
                setCurrentComponent(<div className="unknown-command">Unknown command. Type HELP for a list of commands.</div>);
        }
    };

    return (
        <div className="home">
            <div className="terminal-header">
                <div className="terminal-input-line">
                    <span className="prompt">▶</span>
                    <div className="input-container">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className="terminal-input"
                        />
                        <div className="block-cursor" style={{ left: `${input.length * 0.6}em` }}>▮</div>
                    </div>
                </div>
            </div>
            <div className="component-container">
                {currentComponent}
            </div>
        </div>
    );
}

export default Home;