import React, {useEffect, useState} from 'react';
import NotFound from './NotFound';
import PostCard from '../PostCard';
import { fs } from '../../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';

const CommunityPage = (props) => {
    const [commExists, setCommExists] = useState(true);
    const [posts, setPosts] = useState([]);

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
                let tempResult=docRef.collection('posts').get()
                .then(sub=>{
                    if (sub.docs.length>0){
                        console.log('subcollection posts exists');
                        sub.docs.forEach((doc)=>{
                            console.log(doc.data());
                            tempArray.push(doc.data());
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
                <div id='communityPageProps'>
                    {posts.length ? 
                        <div id='communityPagePostsContainer'>
                            {posts.map((post)=>{
                                console.log(post);
                                return <PostCard post={post} key={uuidv4()}/>
                            })}
                        </div>
                    : 
                        <div id='communityPageEmptyContainer'>
                            No posts. Be the first to post here!
                        </div>
                    }
                </div>
            :
                <NotFound/>
            }
            
        </React.Fragment>
        
    )
}

export default CommunityPage;