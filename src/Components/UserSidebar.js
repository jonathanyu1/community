import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {calcTimeSincePosted} from './Helpers/helperFunctions';

const UserSidebar = (props) => {

    useEffect(()=>{
        console.log(props);
    },[]);

    // <div className='sidebarContainer'>
    //         <div className='sidebarTitle'>
    //             <Link to={`/c/${props.title}`}>
    //                 {`/c/${props.title}`}
    //             </Link>
    //         </div>
    //         <br></br>
    //         <div className='sidebarContent'>
    //             <div>
    //                 {props.description}
    //             </div>
    //             <div>
    //                 <br></br>
    //                 {`Created by: `}
    //                 <Link to={`/user/${props.creator}`}>
    //                     {props.creator}
    //                 </Link>
    //             </div>
    //         </div>
    //     </div>

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