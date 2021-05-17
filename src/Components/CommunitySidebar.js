import React from 'react';
import {Link} from 'react-router-dom';

const CommunitySidebar = (props) => {

    return (
        <div className='sidebarContainer'>
            <div className='sidebarTitle'>
                <Link to={`/c/${props.title}`}>
                    {`/c/${props.title}`}
                </Link>
            </div>
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