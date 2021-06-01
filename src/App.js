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
import firebase, {auth, fs} from './Firebase/firebase.js';

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [userDescription, setUserDescription] = useState('');
    const defaultPicUrl = 'https://firebasestorage.googleapis.com/v0/b/community-83f47.appspot.com/o/outline_person_black_24dp.png?alt=media&token=b5cd056b-dd16-4e76-8d0f-219039626747';
    const storage = firebase.storage();

    const signOut = () => {
        auth().signOut();   
        setIsSignedIn(false);
    }

    const deleteOldPic = (url) => {
        if (url!==defaultPicUrl){
            let picRef = storage.refFromURL(url);
            picRef.delete()
            .catch((error)=>{
                console.log('Error deleting old img:',error);
            })
        }
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

    const getUserDescription = () => {
        let tempDescription = 'This user has not set a description.';
        let result = fs.collection('users').doc(auth().currentUser.uid)
        .get().then(doc=>{
            if (doc.exists){
                return doc.data().description || tempDescription;
            } else {
                console.log('user profile doc does not exist.');
                return tempDescription;
            }
        });
        return result;
    }

    const getProfilePicUrl = () => {
        let tempPic = 'https://firebasestorage.googleapis.com/v0/b/community-83f47.appspot.com/o/outline_person_black_24dp.png?alt=media&token=b5cd056b-dd16-4e76-8d0f-219039626747';
        let result = fs.collection('users').doc(auth().currentUser.uid)
        .get().then(doc=>{
            if (doc.exists){
                return doc.data().photoURL || tempPic;
            } else {
                console.log('user profile doc does not exist.');
                return tempPic;
            }
        });
        return result;
    }

    const authStateObserver = (user) => {
        if (user) { // User is signed in!
            setIsSignedIn(true);
            getProfilePicUrl().then((result)=>{
                setProfilePicUrl(result);
            });
            getUserDescription().then((result)=>{
                setUserDescription(result);
            });
            if (user.displayName){
                setDisplayName(user.displayName);
            } else {
                getDisplayName()
                .then((tempName)=>{
                    setDisplayName(tempName);
                });
            }
        } else { // User is signed out!
            setIsSignedIn(false);
            // Hide user's profile and sign-out button.
            // Show sign-in button.
        }
    }

    // useState(()=>{
    //     auth().onAuthStateChanged(authStateObserver);
    // },[]);
    useEffect(()=>{
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
                        {isSignedIn ? <Settings profilePicUrl={profilePicUrl} userDescription={userDescription}  deleteOldPic={deleteOldPic}/> 
                        : <Redirect to='/signin'/>}
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
