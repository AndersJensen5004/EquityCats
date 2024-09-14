import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import Help from '../Help/Help.js';

const Home = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState([<div key={0}>Welcome to EquityCats Terminal</div>]);
    const [commandOutput, setCommandOutput] = useState(null);
    const outputRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const newOutput = (
                <div key={output.length}>
                    <span>&gt; {input}</span>
                </div>
            );
            setOutput([...output, newOutput]);
            processCommand(input.trim().toUpperCase());
            setInput('');
        }
    };

    const processCommand = (command) => {
        switch (command) {
            case 'HELP':
                setCommandOutput(<Help />);
                break;
            case 'CLEAR':
                setOutput([]);
                setCommandOutput(null);
                break;
            default:
                setCommandOutput(<div>Unknown command. Type HELP for a list of commands.</div>);
        }
    };

    return (
        <div className="home">
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
            <div className="output" ref={outputRef}>
                {output}
            </div>
            {commandOutput && <div className="command-output">{commandOutput}</div>}
        </div>
    );
}

export default Home;
