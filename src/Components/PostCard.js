import React, {useEffect} from 'react';

const PostCard = (props) => {

    useEffect(()=>{
        console.log(props);
    },[]);

    return (
        <div className='postCardContainer'>
            {props.post.title}
        </div>
    )
}

export default PostCard;