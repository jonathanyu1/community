import React, {useEffect, useState} from 'react';

const SidebarSub = (props) => {

    useEffect(()=>{
        console.log(props);
    },[]);

    return (
        <div className='sidebarSubContainer'>
            /c/{props.sub}
        </div>
    )
}

export default SidebarSub;