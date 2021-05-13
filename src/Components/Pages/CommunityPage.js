import React from 'react';

const CommunityPage = (props) => {

    // return 404 component if not found

    return (
        <div id='communityPageProps'>
            {props.match.params.comm}
        </div>
    )
}

export default CommunityPage;