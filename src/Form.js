import React, { useState,useEffect } from 'react';
import Web3 from 'web3';
import './Form.css';
function Form() {
  const [account, setAccount] = useState('No connection');
  const [contractStatus, setContractStatus] = useState('No connection');
  const [formData, setFormData] = useState({
    aadharNumber: '',
    name: '',
    mobileNumber: '',
    registeredID: '',
    insurance: '',
    carbonEmission: '',
  });
  const [searchAadharNumber, setSearchAadharNumber] = useState(''); // State to store the Aadhar number to search
  const [fetchedData, setFetchedData] = useState({}); // State to store the fetched data
  const [serialData, setSerialData] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const validateForm = () => {
    let isValid = true;
    const errors = {};
  
    if (formData.aadharNumber.length !== 12) {
      isValid = false;
      errors.aadharNumber = "Aadhar Number must be 12 digits long";
    }
  
    if (formData.name.trim() === "") {
      isValid = false;
      errors.name = "Name is required";
    }
  
    if (formData.mobileNumber.length !== 10) {
      isValid = false;
      errors.mobileNumber = "Mobile Number must be 10 digits long";
    }
  
    setFormErrors(errors);
    return isValid;
  };
  
  const connectMetamask = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } else {
        setAccount('MetaMask not found');
      }
    } catch (error) {
      console.error(error);
      setAccount('Error connecting to MetaMask');
    }
  };

  const connectContract = () => {
    const abi = [
      {
        "inputs": [
          {
            "internalType": "int256",
            "name": "aadharNo",
            "type": "int256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "int256",
            "name": "mobileNo",
            "type": "int256"
          },
          {
            "internalType": "string",
            "name": "registration",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "insurance",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "emission",
            "type": "string"
          }
        ],
        "name": "addPerson",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "int256",
            "name": "aadharNo",
            "type": "int256"
          }
        ],
        "name": "getdetails",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "int256",
            "name": "",
            "type": "int256"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "int256",
            "name": "aadharNo",
            "type": "int256"
          }
        ],
        "name": "getstatus",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]; // Your contract's ABI
    const contractAddress = '0xfC2992b815Db502B905520d6aDbdD6F19a823D85'; // Your contract's address

    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi, contractAddress);
      setContractStatus(`Connected to contract at ${contractAddress}`);
      return contract; // Return the contract object
    } catch (error) {
      console.error(error);
      setContractStatus('Error connecting to contract');
      return null; // Return null in case of an error
    }
    
  };

  const addPerson = async () => {
    validateForm();
    try {
      const contract = connectContract(); // Initialize the contract
      const result = await contract.methods.addPerson(
       Number(formData.aadharNumber),
        formData.name,
        Number(formData.mobileNumber),
        formData.registeredID,
        formData.insurance,
        serialData
      ).send({ from: account });
  
      // Log the form data to the console
      console.log('Form Data:', formData);
  
      console.log('Transaction Hash:', result.transactionHash);
    } catch (error) {
      console.error(error);
    }
  };
  const findData = async () => {
    try {
      const contract = connectContract();
      // Call the contract's 'getdetails' function to fetch data based on the entered Aadhar number
      const result = await contract.methods.getdetails(Number(searchAadharNumber)).call();

      // Update the 'fetchedData' state with the fetched data
      setFetchedData({
        aadharNumber: Number(searchAadharNumber),
        name: result[0],
        mobileNumber: Number(result[1]),
        registeredID: result[2],
        insurance: result[3],
        carbonEmission: result[4],
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080'); // Connect to the WebSocket server

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      // Update the 'serialData' state with data received from the WebSocket
      setSerialData(event.data);
    };

    return () => {
      ws.close(); // Close the WebSocket connection when the component unmounts
    };
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>CARBON EMISSION PORTAL</h2>
     <center> <h3>Store Sensor Data on Blockchain</h3></center>
      <button onClick={connectMetamask} className="dabba">
        Connect wallet
      </button>
      <p className="metamaskkadata" id="accountArea" style={{ color: '#CFD2CF' }}>
        {account}
      </p>
      <br />
      <button onClick={connectContract} className="dabba">
        Connect contract
      </button>
      <p className="connecthuakinhi" id="contractArea" style={{ color: '#CFD2CF' }}>
        {contractStatus}
      </p>
      <input
        className="set1"
        type="text"
        min="12"
        max="12"
        placeholder="Aadhar Number"
        name="aadharNumber"
        value={formData.aadharNumber}
        onChange={handleChange}
      />
      {formErrors.aadharNumber && <p className="error">{formErrors.aadharNumber}</p>}
      <br />
      <input
        className="set1"
        type="text"
        placeholder="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      {formErrors.name && <p className="error">{formErrors.name}</p>}
      <br />
      <input
        className="set1"
        type="text"
        min="10"
        max="10"
        placeholder="Mobile Number"
        name="mobileNumber"
        value={formData.mobileNumber}
        onChange={handleChange}
      />
      {formErrors.mobileNumber && <p className="error">{formErrors.mobileNumber}</p>}
      <br />
      <input
        className="set1"
        type="text"
        placeholder="Registered ID"
        name="registeredID"
        value={formData.registeredID}
        onChange={handleChange}
      />
      <br />
      <input
        className="set1"
        type="text"
        placeholder="Insurance"
        name="insurance"
        value={formData.insurance}
        onChange={handleChange}
      />
      <br />
      <input
        className="set1"
        type="text"
        placeholder="Carbon Emission"
        name="carbonEmission"
        value={serialData}
        onChange={handleChange}
        readOnly
      />
      <br />
      <button onClick={addPerson} className="dabba">
        Add Details
      </button>
      <br />
      <h1>Search Data</h1>
      <input
        className="set1"
        type="text"
        placeholder="Search by Aadhar Number"
        name="searchAadharNumber"
        value={searchAadharNumber}
        onChange={(event) => setSearchAadharNumber(event.target.value)}
      />
      <button onClick={findData} className="dabba">
        Find Data
      </button>

      {fetchedData.aadharNumber && (
        <div>
          <h3>Fetched Data:</h3>
          <p>Aadhar Number: {fetchedData.aadharNumber}</p>
          <p>Name: {fetchedData.name}</p>
          <p>Mobile Number: {fetchedData.mobileNumber}</p>
          <p>Registered ID: {fetchedData.registeredID}</p>
          <p>Insurance: {fetchedData.insurance}</p>
          <p>Carbon Emission: {fetchedData.carbonEmission}</p>
        </div>
      )}
    </div>
  );
}

export default Form;
