import React, {useEffect, useState} from 'react';
import NotFound from './NotFound';
import PostCard from '../PostCard';
import { fs } from '../../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import {Link} from 'react-router-dom';
import HomeSidebar from '../HomeSidebar';
import CommunitySidebar from '../CommunitySidebar';

const CommunityAllPage = (props) => {
    const [commExists, setCommExists] = useState(true);
    const [posts, setPosts] = useState([]);
    const [commDescription, setCommDescription] = useState('');
    const [commCreator, setCommCreator] = useState('');
    const [postLimit, setPostLimit] = useState(10);

    const handleLoadAllPage = async () => {
        try{
            await loadAllPageInfo();
            let result = await loadAllPagePosts();
            console.log(result);
            if (result && result.length) {
                console.log('posts exist');
                setPosts(result);
            }
        } catch (error){
            console.log('Error loading community page:', error);
        }
    }

    const loadAllPageInfo = () => {
        let result = fs.collection('communities').doc('all').get().then(doc=>{
            if (doc.exists){
                console.log(doc.id);
                console.log(doc.data());
                console.log(doc.data().description);
                setCommDescription(doc.data().description);
                setCommCreator(doc.data().userCreator);
            } else {
                console.log('community does not exist');
                setCommExists(false);
                return null;
            }
        });
    }

    const loadAllPagePosts = () => {
        let tempArray = [];
        let tempPosts = fs.collectionGroup('posts').orderBy('createdTimestamp', 'desc').limit(postLimit);
        let result = tempPosts.get().then((querySnapshot)=>{
            let index=0;
            querySnapshot.forEach((doc)=>{
                console.log(doc.id, ' => ', doc.data());
                tempArray.push(doc.data());
                console.log(index);
                console.log(tempArray[index]);
                tempArray[index].postId=doc.id; 
                index++;
            });
            console.log(tempArray);
            return tempArray;
        });
        return result;
    }

    // useEffect(()=>{
    //     console.log(props.userHasSubs);
    //     if (!props.userHasSubs){
    //         handleLoadAllPage();
    //     }
    // },[props.userHasSubs]);
    useEffect(()=>{
        console.log(props.userHasSubs);
        handleLoadAllPage();
    },[]);

    return (
        <React.Fragment>
            {commExists ? 
                <div className='pageContainer' id='pageAllContainer'>
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
                        {props.isHome && !props.userHasSubs ? 
                            <HomeSidebar />
                        : 
                            <CommunitySidebar
                                title='all'
                                description={commDescription}
                                creator={commCreator}
                            />
                        }
                        
                    </div>
                </div>
                
            :
                <NotFound/>
            }
            
        </React.Fragment>
    )
}

export default CommunityAllPage;