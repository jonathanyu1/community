import React, {useState,useEffect} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import './App.css';
import Nav from './Components/Nav';
import Home from './Components/Home';
import SignUp from './Components/Pages/SignUp';
import SignIn from './Components/Pages/SignIn';
// import firebase, {fs, auth} from './Firebase/firebase.js';
import {auth} from './Firebase/firebase.js';

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    const signOut = () => {
        auth().signOut();   
    }

    const authStateObserver = (user) => {
        if (user) { // User is signed in!
            setIsSignedIn(true);
            console.log(user);
            console.log(user.displayName);
            console.log(auth().currentUser.displayName);
            console.log(user.email);
            console.log(user.uid);
            // Get the signed-in user's profile pic and name.
            // Set the user's profile pic and name.
            // Show user's profile and sign-out button.
            // Hide sign-in button.
        } else { // User is signed out!
            setIsSignedIn(false);
            // Hide user's profile and sign-out button.
            // Show sign-in button.
        }
      }


    useState(()=>{
        auth().onAuthStateChanged(authStateObserver);
    },[]);

    return (
        <BrowserRouter>
            <div id='appContainer'>
            <Nav isSignedIn={isSignedIn} signOut={signOut}/>
                <Switch>
                    {/* <Route exact path='/' component={Home}/> */}
                    <Route 
                        exact path='/' 
                        render={routeProps=>(
                            <Home 
                                {...routeProps}
                                isSignedIn={isSignedIn}
                            />
                        )}
                            />
                    <Route exact path='/signup'>
                        {isSignedIn ? <Redirect to='/'/> : <SignUp/> }
                    </Route>
                    {/* <Route 
                        exact path='/signup' 
                        render={routeProps=>(
                            <Signup
                                {...routeProps}
                                isSignedIn={isSignedIn}
                            />
                        )}
                    /> */}
                    <Route exact path='/signin' component={SignIn}/>
                </Switch>
            </div>
      </BrowserRouter>
  )
}

export default App;
