import React, {useState,useEffect} from 'react';
import CommunitySidebar from '../CommunitySidebar';

const PostPage = (props) => {

    // return 404 component if not found

    return (
        <div className='postPageContainer'>
            {/* <div id='postPageCommunity'>
                {props.match.params.comm}
            </div>
            <div id='postPageId'>
                {props.match.params.id}
            </div> */}
            <div className='pageContentContainer'>

                <CommunitySidebar
                    title={props.match.params.comm}
                    // description={commDescription}
                    // creator={commCreator}
                />
            </div>

        </div>
    )
}

export default PostPage;