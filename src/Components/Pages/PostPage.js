import React from 'react';

const PostPage = (props) => {

    // return 404 component if not found

    return (
        <div id='postPageProps'>
            <div id='postPageCommunity'>
                {props.match.params.comm}
            </div>
            <div id='postPageId'>
                {props.match.params.id}
            </div>
        </div>
    )
}

export default PostPage;