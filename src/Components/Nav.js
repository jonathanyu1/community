import React from 'react';
import {Link} from 'react-router-dom';
import communityHeader from '../Images/Header/communityHeader.png';
import communityAdd from '../Images/Header/communityAdd.png';

const Nav = (props) => {

    return (
        <div id='navContainer'>
            <nav className='nav'>
                <div id='navHeaderContainer'>
                    <Link to='/'>
                        <img 
                            className='navHeaderLogo'
                            src={communityHeader}
                            alt='community header logo'
                        />
                    </Link>
                    <Link to='/'>
                        <div id='navHeader' className='navText'>ommunity</div>
                    </Link>
                </div>
                <ul className='navTabs'>
                    {props.isSignedIn ? 
                        <React.Fragment>
                            <Link to={`/user/${props.displayName}`}>
                                <li className='navProfileInfo'>
                                    <img src={props.profilePicUrl} alt='profilepic' className='navProfilePic'/>
                                    <div className='navText'>{props.displayName}</div>
                                </li>
                            </Link>
                            <Link to='/settings'>
                                <li>
                                    <span className="material-icons-outlined">
                                        settings
                                    </span>
                                </li>
                            </Link>
                            <Link to='/create-community' >
                                <li>
                                    {/* <span className="material-icons-outlined">
                                        create_new_folder
                                    </span> */}
                                    <img 
                                        className='navHeaderIcon'
                                        src={communityAdd}
                                        alt='add community'
                                    />
                                </li>
                            </Link>
                            <Link to='/create-post' >
                                <li>
                                    <span className="material-icons-outlined">
                                        edit
                                    </span>
                                </li>
                            </Link>
                            <Link to='/' >
                                <li className='navText' onClick={props.signOut}>Sign out</li>
                                <span className="material-icons-outlined navIconMobile" onClick={props.signOut}>
                                    logout
                                </span>
                            </Link>
                        </React.Fragment>
                    : 
                        <React.Fragment>
                            <Link to='/signup' >
                                <li className='navText'>Sign Up</li>
                                <span className="material-icons-outlined navIconMobile">
                                    person_add
                                </span>
                            </Link>
                            <Link to='/signin'>
                                <li className='navText'>Sign In</li>
                                <span className="material-icons-outlined navIconMobile">
                                    login
                                </span>
                            </Link>
                            <Link to='/signin' >
                                
                            </Link>
                        </React.Fragment>
                    }
                </ul>
            </nav>
        </div>
    )
}

export default Nav;