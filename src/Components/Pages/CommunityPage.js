import React, {useEffect, useState} from 'react';
import NotFound from './NotFound';
import PostCard from '../PostCard';
import { fs } from '../../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import {Link} from 'react-router-dom';

const CommunityPage = (props) => {
    const [commExists, setCommExists] = useState(true);
    const [posts, setPosts] = useState([]);
    const [commDescription, setCommDescription] = useState('');
    const [commCreator, setCommCreator] = useState('');

    const handleLoadCommunityPage = async () => {
        try{
            let result = await loadCommunityPagePosts();
            console.log(result);
            if (result && result.length) {
                console.log('posts exist');
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
                console.log(doc.id);
                console.log(doc.data());
                console.log(doc.data().description);
                setCommDescription(doc.data().description);
                setCommCreator(doc.data().userCreator);
                let tempResult=docRef.collection('posts').get()
                .then(sub=>{
                    if (sub.docs.length>0){
                        console.log('subcollection posts exists');
                        sub.docs.forEach((doc, index)=>{
                            console.log(doc.data());
                            console.log(doc.id);
                            tempArray.push(doc.data());
                            tempArray[index].postId=doc.id;
                            console.log(tempArray);
                        });
                    } else {
                        console.log('subcollection posts does not exist');
                    }
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

    // return 404 component if not found
    return (
        <React.Fragment>
            {commExists ? 
                <div className='pageContainer'>
                    <div className='pageContentContainer'>
                        {posts.length ? 
                            <div className='pagePostsContainer'>
                                {posts.map((post)=>{
                                    console.log(post);
                                    return <PostCard post={post} key={uuidv4()}/>
                                })}
                            </div>
                        : 
                            <div className='pageEmptyContainer'>
                                No posts. Be the first to post here!
                            </div>
                        }
                        <div className='sidebarContainer'>
                            <div className='sidebarTitle'>
                                {props.match.params.comm}
                            </div>
                            <div className='sidebarContent'>
                                <div>
                                    {commDescription}
                                </div>
                                <div>
                                    Created by: 
                                    <Link to={`/user/${commCreator}`}>
                                        {commCreator}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            :
                <NotFound/>
            }
            
        </React.Fragment>
        
    )
}

export default CommunityPage;