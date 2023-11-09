import React, { useEffect, useState } from 'react';
import './App.css';
import Form from './Form';

const App = () => {
  const [data, setData] = useState('');
  const [carbonEmission, setCarbonEmission] = useState(''); // New state for Carbon Emission

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001'); // Adjust the server address

    socket.onmessage = (event) => {
      setData(event.data);
      // Assuming that the data received is the Carbon Emission value (you may need to parse or format it accordingly)
      setCarbonEmission(event.data);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <h1>Serial Port Data</h1>
      <p>Data received: {data}</p>
      <div className="App">
        <Form carbonEmission={carbonEmission} /> {/* Pass carbonEmission as a prop */}
      </div>
    </div>
  );
};

export default App;
