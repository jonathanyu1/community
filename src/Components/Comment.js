import React, {useEffect, useState} from 'react';
import CommentScore from './CommentScore';
import TextArea from './TextArea';
import DeletePrompt from './DeletePrompt';
import firebase, {auth, fs} from '../Firebase/firebase';
import {calcTimeSincePosted, colorPickerRgb} from './Helpers/helperFunctions';
import {Link} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Comment = (props) => {
    const [showEdit, setShowEdit] = useState(false);
    const [editError, setEditError] = useState('');
    const [showReply, setShowReply] = useState(false);
    const [editTime, setEditTime] = useState('0 seconds');
    const [timeSincePosted, setTimeSincePosted] = useState('0 seconds');
    // const [commentReplyInput, setCommentReplyInput] = useState('');
    const [replyError, setReplyError] = useState('');
    const rgbColor = colorPickerRgb(props.index);
    const borderStyle = {
        borderLeft: `5px solid ${rgbColor}`
    }

    const submitEdit = (newDescription) => {
        return fs.collection('communities').doc(props.match.params.comm)
        .collection('posts').doc(props.match.params.id)
        .collection('comments').doc(props.comment.postId)
        .update({
            description: newDescription,
            lastEdit: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    const handleSubmitEdit = (description) => {
        console.log(props.comment);
        console.log(description);
        if (description === props.comment.description){
            console.log('edit invalid same contents');
            setEditError('Comment has not changed, please try again.')
        } else if (auth().currentUser && auth().currentUser.uid===props.comment.userCreatorUid){
            if (description.length>0){
                setEditError('');
                submitEdit(description);
            } else {
                setEditError('Edits cannot be empty, please try again.');
            }   
        } else {
            setEditError('Please sign in to edit comments.');
        }
    }

    const handleShowEdit = () => {
        setShowEdit(true);
    }

    const handleHideEdit = () => {
        setShowEdit(false);
    }

    const updatePostCommentList = (id) => {
        return fs.collection('communities').doc(props.match.params.comm)
        .collection('posts').doc(props.match.params.id).update({
            commentList: firebase.firestore.FieldValue.arrayUnion(id)
        });
    }

    const submitReply = (commentReplyInput) => {
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

    const handleSubmitReply = (commentReplyInput) => {
        if (auth().currentUser){
            if (commentReplyInput.length>0){
                setReplyError('');
                submitReply(commentReplyInput)
                .then((data)=>{
                    // console.log(data.id);
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

    // const handleReplyInput = (e) => {
    //     setCommentReplyInput(e.target.value);
    // }

    const handleShowReply = () => {
        setShowReply(true);
    }

    const handleHideReply = () => {
        setShowReply(false);
        // setCommentReplyInput('');
    }

    const getTime = () => {
        if (props.comment.createdTimestamp){
            setTimeSincePosted(calcTimeSincePosted(props.comment.createdTimestamp.seconds));
        }
        if (props.comment.lastEdit){
            setEditTime(calcTimeSincePosted(props.comment.lastEdit.seconds))
        }
    }

    useEffect(()=>{
        // console.log(props);
        // console.log(props.comment.createdTimestamp.seconds);
        getTime();
    },[]);

    return (
        <div className='commentContainer' style={borderStyle}>
            <div className='commentTop'>
                <CommentScore 
                    community={props.match.params.comm}
                    postId={props.match.params.id}
                    commentId={props.comment.postId}
                />
                <div className='commentInfo'>
                    <div className='commentSubmission'>
                        {props.comment.userCreator==='[deleted]' ? 
                        props.comment.userCreator
                        :
                        <Link to={`/user/${props.comment.userCreator}`}>
                            {props.comment.userCreator}
                        </Link>
                        }
                        {` Submitted ${timeSincePosted} ago`}
                        {props.comment.lastEdit && 
                        `* (last edited: ${editTime} ago)`
                        }
                    </div>
                    <div className='commentDescription'>
                        {props.comment.description}
                    </div>
                    {/* <div className='commentLinks' onClick={handleShowReply}>
                        Reply
                    </div> */}
                    <div className='commentLinks'>
                        <div className='commentReply' onClick={handleShowReply}>
                            Reply
                        </div>
                        {auth().currentUser && auth().currentUser.uid === props.comment.userCreatorUid && 
                        <React.Fragment>
                        <div className='commentEdit' onClick={handleShowEdit}>
                            Edit
                        </div>
                        <DeletePrompt deleteFunction={props.handleDeleteComment} id={props.comment.postId}/>
                        </React.Fragment>
                        }
                    </div>
                </div>
            </div>
            {showEdit && 
                <div className='commentEditContainer'>
                    <TextArea handleSubmitComment={handleSubmitEdit} defaultText={props.comment.description} textAreaClassName={'postAddReplyInput'} btnClassName={'btnReply'} btnId={'btnSubmitReply'}>
                        <div className='postEditErrorMsg'>
                            {editError}
                        </div>
                    </TextArea>
                    <button
                        className='btnReply'
                        id='btnCancelEdit'
                        onClick={handleHideEdit}
                    >
                        Cancel
                    </button>
                </div>
            }
            {showReply && 
                <div className='commentReplyContainer'>
                    <TextArea handleSubmitComment={handleSubmitReply} textAreaClassName={'postAddReplyInput'} btnClassName={'btnReply'} btnId={'btnSubmitReply'}>
                        <div className='postReplyErrorMsg'>
                            {replyError}
                        </div>
                    </TextArea>
                    {/* <textarea
                        value={commentReplyInput}
                        onChange={handleReplyInput}
                        placeholder='Reply here!'
                        className='postAddReplyInput'
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
                    </button> */}
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
                                index={props.index+1}
                                handleDeleteComment={props.handleDeleteComment}
                            />
                        </div>
                    )
                })
            } 
        </div>
    )
}

export default Comment;