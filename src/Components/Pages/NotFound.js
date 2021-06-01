import React from 'react';
import HomeSidebar from '../HomeSidebar';

const NotFound = () => {

    return (
        <div className='notFoundContainer'>
            <div className='pageContentContainer'>
                <div className='notFoundMessage'>
                    The community you were looking for does not exist. Try exploring one of our other communities!
                </div>
                <HomeSidebar/>
            </div>
        </div>
    )
}

export default NotFound;