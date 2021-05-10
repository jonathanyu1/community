import React, {useState,useEffect} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import './App.css';
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import firebase, {fs, auth} from './Firebase/firebase.js';

const App = () => {


  useEffect(()=>{
    console.log(firebase);
    console.log(fs);
    console.log(auth);
  },[]);

  return (
    <BrowserRouter>
      <div id='appContainer'>
        <NavBar />
          <Switch>
            <Route exact path='/' component={Home}/>

          </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App;
