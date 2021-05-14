import React, {useState,useEffect} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import './App.css';
import Nav from './Components/Nav';
import Home from './Components/Pages/Home';
import SignUp from './Components/Pages/SignUp';
import SignIn from './Components/Pages/SignIn';
import Settings from './Components/Pages/Settings';
import UserPage from './Components/Pages/UserPage';
import CreatePost from './Components/Pages/CreatePost';
import CreateCommunity from './Components/Pages/CreateCommunity';
import CommunityPage from './Components/Pages/CommunityPage';
import CommunityAllPage from './Components/Pages/CommunityAllPage';
import PostPage from './Components/Pages/PostPage';
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

    const getUserById = (id) =>{
        // change this to return user from fs later
        console.log(id);
        return id;
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
                    <Route exact path='/signin'>
                        {isSignedIn ? <Redirect to='/'/> : <SignIn/>}
                    </Route>
                    <Route exact path='/settings'>
                        {isSignedIn ? <Settings/> : <Redirect to='/signin'/>}
                    </Route>
                    <Route exact path='/create-post'>
                        {isSignedIn ? <CreatePost/> : <Redirect to='/signin'/>}
                    </Route>
                    <Route exact path='/create-community'>
                        {isSignedIn ? <CreateCommunity/> : <Redirect to='/signin'/>}
                    </Route>
                    <Route
                        path='/user/:id'
                        render={routeProps=>(
                            <UserPage 
                                {...routeProps}
                                user={(getUserById(routeProps.match.params.id))}
                            />
                        )} 
                    />
                    <Route
                        path='/c/:comm/:id'
                        render={routeProps=>(
                            <PostPage
                                {...routeProps}
                                isSignedIn={isSignedIn}
                            />
                        )} 
                    />
                    <Route
                        exact path='/c/all'
                        render={routeProps=>(
                            <CommunityAllPage 
                                {...routeProps}
                                isSignedIn={isSignedIn}
                            />
                        )} 
                    />
                    <Route
                        path='/c/:comm'
                        render={routeProps=>(
                            <CommunityPage 
                                {...routeProps}
                                isSignedIn={isSignedIn}
                            />
                        )} 
                    />
                </Switch>
            </div>
      </BrowserRouter>
  )
}

export default App;
