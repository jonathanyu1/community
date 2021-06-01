import React, {useState,useEffect} from 'react';
import CommentSection from '../CommentSection';
import CommunitySidebar from '../CommunitySidebar';
import PostScore from '../PostScore';
import NotFound from './NotFound';
import TextArea from '../TextArea';
import {calcTimeSincePosted} from '../Helpers/helperFunctions';
import firebase, {fs, auth} from '../../Firebase/firebase';
import {Link} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const PostPage = (props) => {
    const [postExists, setPostExists] = useState(true);
    const [postDetails, setPostDetails] = useState({});
    const [sidebarDescription, setSidebarDescription] = useState('');
    const [sidebarCreator, setSidebarCreator] = useState('');
    const [showImage, setShowImage] = useState(true);
    const [commentError, setCommentError] = useState('');
    const loadingIcon = <i className="fa fa-spinner" aria-hidden="true"></i>;

    const handleSubmitComment = (commentInput) => {
        if (auth().currentUser){
            if (commentInput.length>0){
                setCommentError('');
                submitComment(commentInput)
                .then((data)=>{
                    data.update({
                        postId: data.id
                    }).catch((error)=>{
                        console.log('Error updating document with doc id:',error);
                    });
                    updatePostCommentList(data.id);
                });
            } else {
                setCommentError('Comments cannot be empty, please try again.');
            }
            
        } else {
            setCommentError('Please sign in to comment.');
        }
    }

    const submitComment = (commentInput) => {
        return fs.collection('communities').doc(props.match.params.comm)
        .collection('posts').doc(props.match.params.id)
        .collection('comments').add({
            userCreator: auth().currentUser.displayName,
            userCreatorUid: auth().currentUser.uid,
            createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            postParent: props.match.params.id,
            description: commentInput,
            uuid: uuidv4(),
            scoreUp: [],
            scoreDown: []
        });
    }

    const updatePostCommentList = (id) => {
        return fs.collection('communities').doc(props.match.params.comm)
        .collection('posts').doc(props.match.params.id).update({
            commentList: firebase.firestore.FieldValue.arrayUnion(id)
        });
    }

    const loadSidebarContent = () => {
        let docRef =fs.collection('communities').doc(props.match.params.comm);
        docRef.get().then(doc=>{
            if (doc.exists){
                setSidebarDescription(doc.data().description);
                setSidebarCreator(doc.data().userCreator);
            } 
            // else {
            //     console.log('Sidebar info does not exist');
            // }
        }).catch((error)=>{
            console.log('Error fetching sidebar content:',error);
        });
    }

    const loadPostContent = () => {
        let tempObj = {};
        let docRef = fs.collection('communities').doc(props.match.params.comm).collection('posts').doc(props.match.params.id);
        let result = docRef.get().then(doc=>{
            if (doc.exists){
                tempObj = {
                    [`title`] : doc.data().title,
                    [`description`] : doc.data().description,
                    [`timestamp`] : doc.data().createdTimestamp.seconds,
                    [`imgUrl`] : doc.data().imgUrl,
                    [`postCreator`] : doc.data().userCreator
                }
            } else {
                setPostExists(false);
            }
            return tempObj
        }).catch((error)=>{
            console.log('Error fetching post:',error);
        });
        return result;
    }

    const handleLoadPostPage = async () => {
        try{
            loadSidebarContent();
            let result = await loadPostContent();
            if (result && Object.keys(result).length) {
                setPostDetails(result);
            }
        } catch (error){
            console.log('Error loading community page:', error);
        }
    }

    useEffect(()=>{
        handleLoadPostPage();
    },[]);

    return (
        <React.Fragment>
            {postExists ?
                <div className='postPageContainer'>
                    <div className='pageContentContainer'>
                        {Object.keys(postDetails).length ? 
                            <div className='postPageLeftContainer'>
                                <div className='postPageContent'>
                                    <div className='postPageContentDetails'>
                                        <div className='postPageLeft'>
                                            <PostScore 
                                                community={props.match.params.comm}
                                                postId={props.match.params.id}
                                            />
                                        </div>
                                        <div className='postPageRight'>
                                            <div className='postPageTitle'>
                                                {postDetails.title}
                                            </div>
                                            <div className='postCardSubmission'>
                                                {postDetails.imgUrl && 
                                                <React.Fragment>
                                                    <i className={`fa fa-times ${showImage ? 'show' : 'hide' }`} aria-hidden="true" onClick={()=>{setShowImage(false)}}></i>
                                                    <i className={`fa fa-file-image-o ${showImage ? 'hide' : 'show' }`} aria-hidden="true" onClick={()=>{setShowImage(true)}}></i>
                                                </React.Fragment>
                                                }
                                                {`Submitted ${calcTimeSincePosted(postDetails.timestamp)} ago by `}
                                                {
                                                    <Link to={`/user/${postDetails.postCreator}`}>
                                                        {postDetails.postCreator}
                                                    </Link>
                                                }
                                                {` to `}
                                                {
                                                    <Link to={`/c/${props.match.params.comm}`}>
                                                        /c/{props.match.params.comm}
                                                    </Link>
                                                }
                                            </div>
                                            {postDetails.imgUrl &&                                         
                                                    <img 
                                                        className={`postPageImg ${showImage ? 'show' : 'hide' }`} 
                                                        src={postDetails.imgUrl} alt={postDetails.title} 
                                                        onClick={()=>{window.open(postDetails.imgUrl)}}
                                                    />
                                            }
                                            {postDetails.description &&
                                            <div className='postPageDescription'>
                                                {postDetails.description}
                                            </div>
                                            }
                                        </div>
                                        
                                    </div>
                                    {props.isSignedIn ? 
                                    <div className='postAddCommentContainer'>
                                        <TextArea handleSubmitComment={handleSubmitComment} textAreaClassName={`postAddCommentInput`} btnClassName={'btnSubmitComment'}>
                                            <div className='postCommentErrorMsg'>
                                                {commentError}
                                            </div>
                                        </TextArea>
                                    </div>
                                    :
                                    <div className='postSignInContainer'>
                                        <span className='postSignInPrompt'>
                                            Sign in or Sign up to comment
                                        </span>
                                        <Link to={`/signin`}>
                                            Sign In
                                        </Link>
                                        <Link to={`/signup`}>
                                            Sign Up
                                        </Link>
                                    </div>
                                    }
                                </div>
                                <CommentSection 
                                    isSignedIn={props.isSignedIn} 
                                    match={props.match}
                                    history={props.history}
                                    location={props.location}
                                />
                            </div>
                        :
                            loadingIcon
                        }
                        <CommunitySidebar
                            title={props.match.params.comm}
                            description={sidebarDescription}
                            creator={sidebarCreator}
                        />
                    </div>
                </div>
            :
                <NotFound/>
            }
        </React.Fragment>
    )
}

export default PostPage;