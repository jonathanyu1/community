import React, {useEffect, useState} from 'react';
import CommentScore from './CommentScore';
import firebase, {auth, fs} from '../Firebase/firebase';
import {calcTimeSincePosted} from './Helpers/helperFunctions';
import {Link} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Comment = (props) => {
    const [showReply, setShowReply] = useState(false);
    const [timeSincePosted, setTimeSincePosted] = useState('0 seconds');
    const [commentReplyInput, setCommentReplyInput] = useState('');
    const [replyError, setReplyError] = useState('');

    const updatePostCommentList = (id) => {
        return fs.collection('communities').doc(props.match.params.comm)
        .collection('posts').doc(props.match.params.id).update({
            commentList: firebase.firestore.FieldValue.arrayUnion(id)
        });
    }

    const submitReply = () => {
        return fs.collection('communities').doc(props.match.params.comm)
        .collection('posts').doc(props.match.params.id)
        .collection('comments').add({
            userCreator: auth().currentUser.displayName,
            userCreatorUid: auth().currentUser.uid,
            createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            postParent: props.comment.postId,
            description: commentReplyInput,
            uuid: uuidv4(),
            scoreUp: [],
            scoreDown: []
        });
    }

    const handleSubmitReply = () => {
        if (auth().currentUser){
            if (commentReplyInput.length>0){
                setReplyError('');
                submitReply()
                .then((data)=>{
                    console.log(data.id);
                    // setCommentReplyInput('');
                    updatePostCommentList(data.id);
                    data.update({
                        postId: data.id
                    }).catch((error)=>{
                        console.log('Error updating document with doc id:',error);
                    });
                });
            } else {
                setReplyError('Comments cannot be empty, please try again.');
            }
            
        } else {
            setReplyError('Please sign in to comment.');
        }
    }

    // const handleSubmitReply = () => {
    //     // handleHideReply();
    // }

    const handleReplyInput = (e) => {
        setCommentReplyInput(e.target.value);
    }

    const handleShowReply = () => {
        setShowReply(true);
    }

    const handleHideReply = () => {
        setShowReply(false);
    }

    const getTime = () => {
        if (props.comment.createdTimestamp){
            setTimeSincePosted(calcTimeSincePosted(props.comment.createdTimestamp.seconds));
        }
    }

    useEffect(()=>{
        console.log(props);
        // console.log(props.comment.createdTimestamp.seconds);
        getTime();
    },[]);

    return (
        <div className='commentContainer'>
            <div className='commentTop'>
                <CommentScore />
                <div className='commentInfo'>
                    <div className='commentSubmission'>
                        {`By: `}
                        <Link to={`/user/${props.comment.userCreator}`}>
                            {props.comment.userCreator}
                        </Link>
                        {`Submitted ${timeSincePosted} ago`}
                    </div>
                    <div className='commentDescription'>
                        {props.comment.description}
                    </div>
                    <div className='commentLinks' onClick={handleShowReply}>
                        Reply
                    </div>
                </div>
            </div>
            {showReply && 
                <div className='commentReplyContainer'>
                    <textarea
                        value={commentReplyInput}
                        onChange={handleReplyInput}
                        placeholder='Reply here!'
                        className='postAddCommentInput'
                        required
                    >
                    </textarea>
                    <div className='postReplyErrorMsg'>
                        {replyError}
                    </div>
                    <button
                        className='btnReply'
                        id='btnSubmitReply'
                        onClick={handleSubmitReply}
                    >
                        Submit
                    </button>
                    <button
                        className='btnReply'
                        id='btnCancelReply'
                        onClick={handleHideReply}
                    >
                        Cancel
                    </button>
                </div>
            }
            {props.childComments && props.childComments.length>0 && 
                
                props.childComments.map((comment)=>{
                    let childComments=null;
                    if (comment.uuid){
                        childComments = props.allComments.filter(comm => comment.postId === comm.postParent);
                    }
                    return (
                        <div className='replyContainer'>
                            <Comment 
                                key={uuidv4()}
                                childComments={childComments}
                                comment={comment}
                                allComments={props.allComments}
                                match={props.match}
                                history={props.history}
                                location={props.location}
                            />
                        </div>
                    )
                })
            } 
        </div>
    )
}

export default Comment;