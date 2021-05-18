import React, {useState,useEffect} from 'react';
import CommunitySidebar from '../CommunitySidebar';
import NotFound from './NotFound';
import {calcTimeSincePosted} from '../Helpers/helperFunctions';
import {fs} from '../../Firebase/firebase';
import {Link} from 'react-router-dom';


const PostPage = (props) => {
    const [postExists, setPostExists] = useState(true);
    // const [title, setTitle] = useState('');
    // const [description, setDescription] = useState('');
    // const [timestamp, setTimestamp] = useState('');
    // const [imgUrl, setImgUrl] = useState('');
    // // const [scoreUp, setScoreUp] = useState('');
    // // const [scoreDown, setScoreDown] = useState('');
    // // const [imgStorageUri, setImgStorageUri] = ('');
    // const [postCreator, setPostCreator] = useState('');
    // // const [postCreatorUid, setPostCreatorUid] = useState('');
    const [postDetails, setPostDetails] = useState({});
    const [sidebarDescription, setSidebarDescription] = useState('');
    const [sidebarCreator, setSidebarCreator] = useState('');
    const [showImage, setShowImage] = useState(true);
    const loadingIcon = <i className="fa fa-spinner" aria-hidden="true"></i>;

    const loadSidebarContent = () => {
        let docRef =fs.collection('communities').doc(props.match.params.comm);
        docRef.get().then(doc=>{
            if (doc.exists){
                console.log(doc.data());
                setSidebarDescription(doc.data().description);
                setSidebarCreator(doc.data().userCreator);
            } else {
                console.log('Sidebar info does not exist');
            }
        }).catch((error)=>{
            console.log('Error fetching sidebar content:',error);
        });
    }

    const loadPostContent = () => {
        let tempObj = {};
        let docRef = fs.collection('communities').doc(props.match.params.comm).collection('posts').doc(props.match.params.id);
        let result = docRef.get().then(doc=>{
            if (doc.exists){
                console.log(doc.data());
                // setTitle(doc.data().title);
                // setDescription(doc.data().description);
                // setTimestamp(doc.data().createdTimestamp.seconds);
                // setImgUrl(doc.data().imgUrl);
                // setPostCreator(doc.data().userCreator);
                tempObj = {
                    [`title`] : doc.data().title,
                    [`description`] : doc.data().description,
                    [`timestamp`] : doc.data().createdTimestamp.seconds,
                    [`imgUrl`] : doc.data().imgUrl,
                    [`postCreator`] : doc.data().userCreator
                }
            } else {
                console.log('Post does not exist.');
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
                console.log('post exist');
                setPostDetails(result);
            }
        } catch (error){
            console.log('Error loading community page:', error);
        }
    }


    useEffect(()=>{
        if (Object.keys(postDetails).length){
            console.log(postDetails);
        }
    },[postDetails]);

    useEffect(()=>{
        handleLoadPostPage();
    },[]);

    return (
        <React.Fragment>
            {postExists ?
                <div className='postPageContainer'>
                    <div className='pageContentContainer'>
                        {Object.keys(postDetails).length ? 
                            <div className='postPageContent'>
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