import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import PostScore from './PostScore';
import DeletePrompt from './DeletePrompt';
import {calcTimeSincePosted} from './Helpers/helperFunctions';
import {auth} from '../Firebase/firebase';

const PostCard = (props) => {
    //required props: object with post info, postDelete function

    const [timeSincePost, setTimeSincePost] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    const calculateTime = () => {
        setTimeSincePost(calcTimeSincePosted(props.post.createdTimestamp.seconds));
    }

    useEffect(()=>{
        calculateTime();
    },[]);

    return (
        <div className='postCardContainer'>
            <div className='postCardLeftContainer'>
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
                                {props.post.commentList && props.post.commentList.length ? 
                                    `${props.post.commentList.length} comment${props.post.commentList.length>1 ? 's':''}`
                                :
                                    `0 comments`
                                }
                            </Link>
                            {auth().currentUser && auth().currentUser.uid === props.post.userCreatorUid && 
                            <DeletePrompt deleteFunction={props.handleDeletePost} id={props.post.postId} community={props.post.community}/>
                            }
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