import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {signin} from '../Helpers/auth';

const SignIn = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        switch (e.target.name){
            case 'email':
                setEmail(e.target.value);
                break;
            case 'password':
                setPassword(e.target.value);
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        signin(email,password)
        .catch((error)=>{
            console.log('Error with signin:',error.message);
            setErrorMsg(error.message);
        });
    }


    return (
        <div id='signInContainer'>
            <form
                autoComplete="off"
                onSubmit={handleSubmit}
                className='signInForm'
            >
                <h1>
                    {`Sign in to `}
                    <Link to="/">
                        Community
                    </Link>
                </h1>
                <p>
                    Fill in the form below to login to your account.
                </p>
                <div>
                    <input
                        className='signInEmailInput'
                        placeholder="Email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                        value={email}
                    />
                </div>
                <div>
                    <input
                        className='signInPasswordInput'
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        value={password}
                        type="password"
                    />
                </div>
                <div>
                    {errorMsg ? (
                        <p>{errorMsg}</p>
                    ) : null}
                    <button type="submit" className='btnSubmit'>Login</button>
                </div>
                <hr />
                <p>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </form>
        </div>
    )
}

export default SignIn;