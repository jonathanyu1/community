import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {signup} from '../Helpers/auth';

const SignUp = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        signup(email, password)
        .then((userCredential)=>{
            console.log(userCredential);
            console.log(userCredential.user);
            return userCredential.user.updateProfile({
                displayName: username
            });
        })
        .catch ((error)=>{
                console.log('Error with sign up:',error);
                console.log(error.message);
                setErrorMsg(error.message);
        });
    }

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setErrorMsg('');
    //     try{
    //         signup(email, password);
    //     } catch (error){
    //         console.log('Error with sign up:',error);
    //         console.log(error.message);
    //         setErrorMsg(error.message);
    //     }
    // }

    const handleChange = (e) => {
        switch (e.target.name){
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
            case 'username':
                setUsername(e.target.value);
                break;
        }
    }

    return (
        <div id='signUpContainer'>
            <div>
                <form onSubmit={handleSubmit}>
                    <h1>
                        Sign Up to
                    <Link to="/">Community</Link>
                    </h1>
                    <p>Fill in the form below to create an account.</p>
                    <div>
                        <input placeholder='Username' name='username' onChange={handleChange} value={username} minLength='3'></input>
                    </div>
                    <div>
                        <input placeholder="Email" name="email" type="email" onChange={handleChange} value={email}></input>
                    </div>
                    <div>
                        <input placeholder="Password" name="password" onChange={handleChange} value={password} type="password"></input>
                    </div>
                    <div>
                        {errorMsg ? <p>{errorMsg}</p> : null}
                        <button type="submit">Sign up</button>
                    </div>
                    <hr></hr>
                    <p>Already have an account? <Link to="/signin">Sign In</Link></p>
                </form>
            </div>
        </div>
    )
}

export default SignUp;