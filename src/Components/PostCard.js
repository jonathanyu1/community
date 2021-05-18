import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {calcTimeSincePosted} from './Helpers/helperFunctions';

const PostCard = (props) => {
    const [timeSincePost, setTimeSincePost] = useState('');

    const calculateTime = () => {
        // need to finish this
        setTimeSincePost(calcTimeSincePosted(props.post.createdTimestamp.seconds));
        // setTimeSincePost(`${props.post.createdTimestamp.seconds} seconds ago`);
    }

    useEffect(()=>{
        console.log(props);
        calculateTime();
    },[]);

    return (
        <div className='postCardContainer'>
            <div className='postCardTitle'>
                <Link to={`/c/${props.post.community}/${props.post.postId}`}>
                    {props.post.title}
                </Link>
            </div>
            <div className='postCardSubmission'>
                {`Submitted ${timeSincePost} ago by `}
                {
                    <Link to={`/user/${props.post.userCreator}`}>
                        {props.post.userCreator}
                    </Link>
                }
                {` to `}
                {
                    <Link to={`/c/${props.post.community}`}>
                        /c/{props.post.community}
                    </Link>
                }
            </div>
            <div className='postCardLinks'>
                <Link to={`/c/${props.post.community}/${props.post.postId}`}>
                    {/* Need to figure out counting nesting comments here later */}
                    {`Comments`}
                </Link>
                {/* <div onClick={() => {navigator.clipboard.writeText(this.state.textToCopy)}}>
                    Share
                </div> */}
            </div>
        </div>
    )
}

export default PostCard;