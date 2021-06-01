import React from 'react';
import {Link} from 'react-router-dom';
import {calcTimeSincePosted} from './Helpers/helperFunctions';

const UserSidebar = (props) => {

    return (
        <div className='sidebarContainer'>
            <div className='sidebarPicContainer'>
                <img 
                    className='sidebarPic'
                    src={props.userPhotoUrl} 
                    alt={props.match.params.id}
                />
            </div>
            <div className='sidebarTitle'>
                <Link to={`/user/${props.match.params.id}`}>
                     {`/user/${props.match.params.id}`}
                 </Link>
            </div>
            <br></br>
            <div className='sidebarContent'>
                <div>
                    {props.userDescription}
                </div>
                <br></br>
                {`Community user since: `}
                {calcTimeSincePosted(props.userSince)}
                {` ago`}
            </div>
        </div>
    )
}

export default UserSidebar;