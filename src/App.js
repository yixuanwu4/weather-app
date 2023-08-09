import './App.css';
import React, { useEffect, useState } from "react";
import db from '/home/nauxiy/Workspace/tmp/learning/JSprojects/weather/src/db.json';

// import Weather from './components/weather';
export default function App() {
  // State
  const [apiData, setApiData] = useState({});
  const [getState, setGetState] = useState('Wuhan');
  const [state, setState] = useState('Wuhan');
  const [data, setData] = useState({cities: []});
  const [searches, setSearches] = useState([]);
  const [showHistory, setShowHistory] = useState(true);

  var db = require('/home/nauxiy/Workspace/tmp/learning/JSprojects/weather/src/db.json');

  
  const apiKey = process.env.REACT_APP_API_KEY;
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${state}&appid=${apiKey}`;

  // Side effect
  useEffect(() => {
    fetch(apiURL)
    .then((res) => res.json())
    .then((data) => setApiData(data));
  }, [apiURL]);
  

  useEffect(() => {
    fetch("http://localhost:3000/cities")
    .then((res) => res.json())
    .then((data) => {setData({cities: data});
    setSearches(data.map((city) => city.name));
    });
  }, []);

  const addCity = (item) => {
    const requestOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    };
  
    // Make a POST request to json-server to add the new city
    fetch("http://localhost:3000/cities", requestOption)
      .then((res) => res.json())
      .then((data) => {
        // After successful addition, update the local state with the new city
        setData((prevState) => ({
          cities: Array.isArray(prevState.cities) ? [...prevState.cities, data] : [data],
        }));
      })
      .catch((error) => {
        console.error("Error adding city:", error);
      });
  };
  



  const inputHandler = (e) => {
    setGetState(e.target.value);
  };

  const submitHandler = () => {
    setState(getState);
    const newCity = { name: getState };
    addCity(newCity); // Call the addCity function here

    setSearches((prevSearches) => [...prevSearches, getState]);
  };

  const kelvinToFarenheit = (k) => {
    return (k - 273.15).toFixed(2);
  };

  // console.log(apiData)

  const searchHistory = () => {
    return searches.map((city, index) => (
      <p key={index}> {city} </p>
    ));
  };

  
  return (
    <div className="App">
      <header className='header'>
        React Weather App
      </header>
      <div>
        <label className='addCity'>
          Enter Location:  
        </label>
      
        <input className='input' type='text' onChange={inputHandler} value={getState} />
      </div>
      <div>
        <button className='btn' onClick={submitHandler}>
          Search!
        </button>
        <button className='btn' onClick = {searchHistory}>History</button>
      </div>
      <div className='searchResult'>
        {apiData.main ? (
          <div>
            <p className='returnName'>{apiData.name}</p>
            <p className='returnTemp'>
              {kelvinToFarenheit(apiData.main.temp)}&deg; C
            </p>
            <p className=''>
              {apiData.weather[0].description}
            </p>
          </div>
        ) : (
          <h1> Loading </h1>
        )
        }
      </div>
      <div>
        <p>Search History: </p>
        {searches.length > 0 ? (
          searchHistory()
        ) : (
          <p>No search history available.</p>
        )}
      </div>
      

      
    </div>
  );
}