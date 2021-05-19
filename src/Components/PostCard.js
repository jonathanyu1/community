import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import PostScore from './PostScore';
import {calcTimeSincePosted} from './Helpers/helperFunctions';
import {fs} from '../Firebase/firebase';

const PostCard = (props) => {
    const [timeSincePost, setTimeSincePost] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    const calculateTime = () => {
        setTimeSincePost(calcTimeSincePosted(props.post.createdTimestamp.seconds));
        // setTimeSincePost(`${props.post.createdTimestamp.seconds} seconds ago`);
    }

    useEffect(()=>{
        console.log(props);
        calculateTime();
    },[]);

    return (
        <div className='postCardContainer'>
            <div className='postCardLeftContainer'>
                {/* <span className={`material-icons-outlined ${isUpvote?'activeUpvote':''}`} id='thumbUp' onClick={handleVoteClick}>
                    thumb_up
                </span>
                <span className={`postCardScore ${isUpvote?'activeUpvote':''} ${isDownvote?'activeDownvote':''}`}>{score}</span>
                <span className={`material-icons-outlined ${isDownvote?'activeDownvote':''}`} id='thumbDown' onClick={handleVoteClick}>
                    thumb_down
                </span> */}
                <PostScore
                    community={props.post.community}
                    postId={props.post.postId} 
                />
            </div>
            <div className='postCardRightContainer'>
                <div className='postCardTitle'>
                    <Link to={`/c/${props.post.community}/${props.post.postId}`}>
                        {props.post.title}
                    </Link>
                </div>
                <div className='postCardDetails'>
                    {props.post.imgUrl && 
                    <React.Fragment>
                        <i className={`fa fa-times ${showInfo ? 'show' : 'hide' }`} aria-hidden="true" onClick={()=>{setShowInfo(false)}}></i>
                        <i className={`fa fa-file-image-o ${showInfo ? 'hide' : 'show' }`} aria-hidden="true" onClick={()=>{setShowInfo(true)}}></i>
                    </React.Fragment>
                    }
                    {props.post.description && !props.post.imgUrl &&
                    <React.Fragment>
                        <i className={`fa fa-times ${showInfo ? 'show' : 'hide' }`} aria-hidden="true" onClick={()=>{setShowInfo(false)}}></i>
                        <i className={`fa fa-list ${showInfo ? 'hide' : 'show' }`} aria-hidden="true" onClick={()=>{setShowInfo(true)}}></i>
                    </React.Fragment>
                    }
                    <div className='postCardDetailsRight'>
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
                                {props.post.commentList && props.post.commentList.length ? 
                                    `${props.post.commentList.length} comment${props.post.commentList.length>1 ? 's':''}`
                                :
                                    `0 comments`
                                }
                                
                            </Link>
                            {/* <div onClick={() => {navigator.clipboard.writeText(this.state.textToCopy)}}>
                                Share
                            </div> */}
                        </div>
                    </div>
                </div>
                {props.post.imgUrl && 
                <img 
                    className={`postPageImg ${showInfo ? 'show' : 'hide' }`} 
                    src={props.post.imgUrl} 
                    alt={props.post.title}
                />
                }
                {props.post.description &&
                <div className={`postCardDescription ${showInfo ? 'show' : 'hide' }`} >
                    {props.post.description}
                </div>
                }
            </div>
        </div>
    )
}

export default PostCard;