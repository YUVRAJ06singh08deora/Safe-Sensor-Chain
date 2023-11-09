import React, { useState } from 'react';
import Web3 from 'web3';

const App = () => {
  const [account, setAccount] = useState('');
  const [contractArea, setContractArea] = useState('No connection');
  const [personData, setPersonData] = useState(null);

  const connectMetamask = async () => {
    if (window.ethereum !== undefined) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(`Connected Successfully<br>${accounts[0]}`);
    }
  };

  const connectContract = async () => {
    const ABI = [
      {
        // ... Your ABI ...
      },
    ];

    const address = '0x2B824eF9745f98CA25eDD9F2de30326c775E88cd';

    window.web3 = new Web3(window.ethereum);
    window.contract = new window.web3.eth.Contract(ABI, address);

    setContractArea('Connected Successfully');
  };

  const addPerson = async () => {
    const aadharNo = Number(document.getElementById('farmerArea1').value);
    const name = document.getElementById('farmerArea2').value;
    const mobileNo = Number(document.getElementById('farmerArea3').value);
    const registration = document.getElementById('farmerArea4').value;
    const insurance = document.getElementById('farmerArea5').value;
    const emission = document.getElementById('carbonEmission').value;

    await window.contract.methods
      .addPerson(aadharNo, name, mobileNo, registration, insurance, emission)
      .send({ from: account });
    console.log('Details added');
  };

  const getdetails = async () => {
    const sankhya = document.getElementById('personplace').value;
    const person = await window.contract.methods.getdetails(sankhya).call();
    setPersonData(person[4]);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="form">
          <h2>Safe Sensor Chain For Storing Carbon Emission Data From IOT-Based Sensor</h2>
          <div className="inputbox">
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
              {contractArea}
            </p>
            <br />
            <input className="set1" type="text" min="12" max="12" placeholder="Aadhar Number" id="farmerArea1" />
            <br />
            <br />
            <input className="set1" type="text" placeholder="Name" id="farmerArea2" />
            <br />
            <br />
            <input className="set1" type="text" min="10" max="10" placeholder="Mobile Number" id="farmerArea3" />
            <br />
            <br />
            <input className="set1" type="text" placeholder="Registered ID" id="farmerArea4" />
            <br />
            <br />
            <input className="set1" type="text" placeholder="Insurance" id="farmerArea5" />
            <br />
            <br />
            <input className="set1" type="text" placeholder="Carbon Emission" id="carbonEmission" />
            <br />
            <br />
            <button onClick={addPerson} className="dabba">
              Add Details
            </button>
            <br />
            <br />
            <button className="dabba">
              <a href="index2.html">Fetch Details</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
