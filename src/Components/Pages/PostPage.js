import React, {useState,useEffect} from 'react';
import CommunitySidebar from '../CommunitySidebar';
import {fs} from '../../Firebase/firebase';
import NotFound from './NotFound';

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
                    {/* <div id='postPageCommunity'>
                        {props.match.params.comm}
                    </div>
                    <div id='postPageId'>
                        {props.match.params.id}
                    </div> */}
                    <div className='pageContentContainer'>
                        <div className='pagePostContainer'>

                        </div>
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