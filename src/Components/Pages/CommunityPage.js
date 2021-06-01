import React, {useEffect, useState} from 'react';
import NotFound from './NotFound';
import PostCard from '../PostCard';
import CommunitySidebar from '../CommunitySidebar';
import {handleDeletePost} from '../Helpers/helperFunctions';
import { fs } from '../../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
// import {Link} from 'react-router-dom';


const CommunityPage = (props) => {
    const [commExists, setCommExists] = useState(true);
    const [posts, setPosts] = useState([]);
    const [commDescription, setCommDescription] = useState('');
    const [commCreator, setCommCreator] = useState('');
    const [postLimit, setPostLimit] = useState(10);

    const handleLoadCommunityPage = async () => {
        try{
            let result = await loadCommunityPagePosts();
            if (result && result.length) {
                setPosts(result);
            }
        } catch (error){
            console.log('Error loading community page:', error);
        }
    }

    const loadCommunityPagePosts = () => {
        let tempArray = [];
        let docRef = fs.collection('communities').doc(props.match.params.comm);
        let result = docRef.get().then(doc=>{
            if (doc.exists){
                setCommDescription(doc.data().description);
                setCommCreator(doc.data().userCreator);
                let tempResult=docRef.collection('posts').orderBy('createdTimestamp', 'desc').limit(postLimit).get()
                .then(sub=>{
                    if (sub.docs.length>0){
                        sub.docs.forEach((doc, index)=>{
                            tempArray.push(doc.data());
                            tempArray[index].postId=doc.id;
                        });
                    } 
                    // else {
                    //     console.log('subcollection posts does not exist');
                    // }
                    return tempArray;
                });
                return tempResult;
            } else {
                console.log('community does not exist');
                setCommExists(false);
                return null;
            }
        });
        return result;
    }

    useEffect(()=>{
        handleLoadCommunityPage();
    },[]);

    return (
        <React.Fragment>
            {commExists ? 
                <div className='pageContainer'>
                    <div className='pageContentContainer'>
                        {posts.length ? 
                            <div className='pagePostsContainer'>
                                {posts.map((post)=>{
                                    return <PostCard post={post} key={uuidv4()} handleDeletePost={handleDeletePost}/>
                                })}
                            </div>
                        : 
                            <div className='pageEmptyContainer'>
                                No posts. Be the first to post here!
                            </div>
                        }
                        <CommunitySidebar 
                            title={props.match.params.comm}
                            description={commDescription}
                            creator={commCreator}
                            isSignedIn={props.isSignedIn}
                        />
                    </div>
                </div>
                
            :
                <NotFound/>
            }
            
        </React.Fragment>
        
    )
}

export default CommunityPage;