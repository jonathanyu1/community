import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import firebase, { fs } from '../../Firebase/firebase';
import {signup} from '../Helpers/auth';

const SignUp = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const checkAvailableName = () => {
        let tempAvail = true;
        let docRef = fs.collection('users');
        let avail = docRef.get().then((ref)=>{
            ref.forEach((doc)=>{
                if (doc.data().displayName.toLowerCase()===username.toLowerCase()){
                    tempAvail = false;
                }
            });
            return tempAvail;
        }).catch((error)=>{
            console.log('Error checking name:', error);
            return false;
        });
        return avail;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (username.length && username.length>3 && username.length<16){
            checkAvailableName().then((result)=>{
                if (result){
                    signup(email, password)
                    .then((userCredential)=>{
                        userCredential.user.updateProfile({
                            displayName: username
                        });
                        return fs.collection('users').doc(`${userCredential.user.uid}`).set({
                            uid: userCredential.user.uid,
                            displayName: username,
                            email: email,
                            createdTimestamp: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    })
                    .catch ((error)=>{
                            console.log('Error with sign up:',error);
                            setErrorMsg(error.message);
                    });
                } else {
                    setErrorMsg('That username is not available, please choose another one.');
                }
            });
        } else {
            setErrorMsg('Please enter a valid username with atleast 3 characters and less than 20 characters.');
        }
    }
        

    const handleChange = (e) => {
        switch (e.target.name){
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'username':
                setUsername(e.target.value.replace(/[!@#$%^&*(),.?":{}[|<>/`'_\s\\]/g, ''));
                break;
        }
    }

    return (
        <div id='signUpContainer'>
            <form onSubmit={handleSubmit} className='signUpForm' autoComplete="off">
                <h1>
                    {`Sign Up to `}
                <Link to="/">Community</Link>
                </h1>
                <p>Fill in the form below to create an account.</p>
                <div>
                    <input 
                        className='signUpUsernameInput'
                        placeholder='Username' 
                        name='username' 
                        onChange={handleChange} 
                        value={username} 
                        minLength='3'
                        maxLength='16'
                    ></input>
                </div>
                <div>
                    <input 
                        className='signUpEmailInput'
                        placeholder="Email" 
                        name="email" 
                        type="email" 
                        onChange={handleChange} 
                        value={email}
                    ></input>
                </div>
                <div>
                    <input 
                        className='signUpPasswordInput'
                        placeholder="Password" 
                        name="password" 
                        onChange={handleChange}
                        value={password} 
                        type="password"
                    ></input>
                </div>
                <div>
                    {errorMsg ? <p>{errorMsg}</p> : null}
                    <button type="submit" className='btnSubmit'>Sign up</button>
                </div>
                <hr></hr>
                <p>Already have an account? <Link to="/signin">Sign In</Link></p>
            </form>
        </div>
    )
}

export default SignUp;