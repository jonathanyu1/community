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
                            <Link to='/create-community' >
                                <li>
                                    <span className="material-icons-outlined">
                                        create_new_folder
                                    </span>
                                </li>
                            </Link>
                            <Link to='/create-post' >
                                <li>
                                    <span className="material-icons-outlined">
                                        edit
                                    </span>
                                </li>
                            </Link>
                            {/* <Link to={`/user/${props.displayName}`}>
                                <li>
                                    <img src={props.profilePicUrl} alt='profilepic'/>
                                </li>
                            </Link>
                            <Link to={`/user/${props.displayName}`}>
                                <li>{props.displayName}</li>
                            </Link> */}
                            <Link to={`/user/${props.displayName}`}>
                                <li className='navProfileInfo'>
                                    <img src={props.profilePicUrl} alt='profilepic' className='navProfilePic'/>
                                    {props.displayName}
                                </li>
                            </Link>
                            <Link to='/settings'>
                                <li>
                                    <span className="material-icons-outlined">
                                        settings
                                    </span>
                                </li>
                            </Link>
                            <Link to='/' >
                                <li onClick={props.signOut}>Sign out</li>
                            </Link>
                        </React.Fragment>
                    : 
                        <React.Fragment>
                            <Link to='/signup' >
                                <li>Sign Up</li>
                            </Link>
                            <Link to='/signin'>
                                <li>Sign In</li>
                            </Link>
                        </React.Fragment>
                    }
                </ul>
            </nav>
        </div>
    )
}

export default Nav;