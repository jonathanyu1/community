import React, {useState,useEffect} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import './App.css';
import Nav from './Components/Nav';
import Home from './Components/Home';
import SignUp from './Components/Pages/SignUp';
import SignIn from './Components/Pages/SignIn';
// import firebase, {fs, auth} from './Firebase/firebase.js';
import {auth, fs} from './Firebase/firebase.js';

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [displayName, setDisplayName] = useState('');

    const signOut = () => {
        auth().signOut();   
    }

    const getDisplayName = () => {
        return fs.collection('users').doc(`${auth().currentUser.uid}`).get().then((doc)=>{
            if (doc.exists){
                return doc.data().displayName;
            } else {
                return null;
            }
        });
        ;
    }

    const getProfilePicUrl = () => {
        console.log(auth().currentUser);
        return auth().currentUser.photoURL || 'https://firebasestorage.googleapis.com/v0/b/community-83f47.appspot.com/o/outline_person_black_24dp.png?alt=media&token=b5cd056b-dd16-4e76-8d0f-219039626747';
    }

    const authStateObserver = (user) => {
        if (user) { // User is signed in!
            setIsSignedIn(true);
            console.log(user);
            console.log(user.displayName);
            console.log(auth().currentUser.displayName);
            console.log(user.email);
            console.log(user.uid);
            let tempUrl = getProfilePicUrl();
            setProfilePicUrl(tempUrl);
            console.log(tempUrl);
            if (user.displayName){
                console.log(user.displayName);
                setDisplayName(user.displayName);
            } else {
                getDisplayName()
                .then((tempName)=>{
                    console.log(tempName);
                    setDisplayName(tempName);
                });
            }
            
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
            <Nav 
                isSignedIn={isSignedIn} 
                signOut={signOut}
                displayName={displayName}
                profilePicUrl={profilePicUrl}
            />
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
                    {/* <Route exact path='/signin' component={SignIn}/> */}
                    <Route exact path='/signin'>
                        {isSignedIn ? <Redirect to ='/'/> : <SignIn/>}
                    </Route>
                </Switch>
            </div>
      </BrowserRouter>
  )
}

export default App;
