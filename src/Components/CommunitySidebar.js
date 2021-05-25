import React from 'react';
import {Link} from 'react-router-dom';
import SubscribeButton from './SubscribeButton';

const CommunitySidebar = (props) => {

    return (
        <div className='sidebarContainer'>
            <div className='sidebarTitle'>
                <Link to={`/c/${props.title}`}>
                    {`/c/${props.title}`}
                </Link>
            </div>
            {props.isSignedIn && <SubscribeButton title={props.title} isSignedIn={props.isSignedIn}/>}
            <br></br>
            <div className='sidebarContent'>
                <div>
                    {props.description}
                </div>
                <div>
                    <br></br>
                    {`Created by: `}
                    <Link to={`/user/${props.creator}`}>
                        {props.creator}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CommunitySidebar;