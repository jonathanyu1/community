import React from 'react';

const CommunityPage = (props) => {

    return (
        <div id='communityPageProps'>
            {props.match.params.id}
        </div>
    )
}

export default CommunityPage;