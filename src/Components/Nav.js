import React from 'react';
import {Link} from 'react-router-dom';

const Nav = (props) => {

    return (
        <div id='navContainer'>
            <nav className='nav'>
                <div id='navHeaderContainer'>
                    <Link to='/'>
                        <div id='navHeader'>Community</div>
                    </Link>
                </div>
                <ul className='navTabs'>
                    {props.isSignedIn ? 
                        <React.Fragment>
                            <Link to='/' >
                                <li onClick={props.signOut}>Sign out</li>
                            </Link>
                        </React.Fragment>
                    : 
                        <React.Fragment>
                            <Link to='/signup' >
                                <li>Sign Up</li>
                            </Link>
                            <Link to='/login'>
                                <li>Login</li>
                            </Link>
                        </React.Fragment>
                    }
                </ul>
            </nav>
        </div>
    )
}

export default Nav;