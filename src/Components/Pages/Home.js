import React, {useEffect, useState} from 'react';
import CommunityAllPage from './CommunityAllPage';
import HomeSidebar from '../HomeSidebar';
import PostCard from '../PostCard';
import { v4 as uuidv4 } from 'uuid';
import {fs, auth} from '../../Firebase/firebase';
import {handleDeletePost} from '../Helpers/helperFunctions';


const Home = (props) => {
    const [userSubs, setUserSubs] = useState([]);
    const [userHasSubs, setUserHasSubs] = useState(true);
    const [postLimit, setPostLimit] = useState(15);
    const [posts, setPosts] = useState([]);

    const loadHomePagePosts = async (subs) => {
        let tempPosts = [];
        let tempAllPosts = [];
        let i,j, tempSubs, increment = 10;
        for (i=0, j=subs.length; i<j; i+=10){
            tempSubs = subs.slice(i, i+increment);
            await fs.collectionGroup('posts').where('community', 'in', tempSubs)
                .orderBy('createdTimestamp', 'desc')
                .get().then((querySnapshot)=>{
                    let index=0;
                    querySnapshot.forEach((doc)=>{
                        tempPosts.push(doc.data());
                        tempPosts[index].postId=doc.id;
                        index++;
                    });
                    return tempPosts;
                }).then((result)=>{
                    tempAllPosts = [...tempAllPosts, ...result];
                }).catch((error)=>{
                    console.log('Error fetching sub posts:',error);
            });
        }
        return tempAllPosts;
    }

    const loadUserSubs = () => {
        let tempUserSubs = fs.collection('users').doc(auth().currentUser.uid).get().then((doc)=>{
            if (doc.exists){
                return doc.data().communitySubs || [];
            } else {
                return [];
            }
        }).catch((error)=>{
            console.log('Error fetching user subs:',error);
            return [];
        });
        return tempUserSubs;
    }

    const handleLoadHomePage = async () => {
        try{
            let tempUserSubs = await loadUserSubs();
            if (tempUserSubs.length>0){
                setUserHasSubs(true);
                setUserSubs(tempUserSubs);
                let result = await loadHomePagePosts(tempUserSubs);
                if (result && result.length) {
                    setPosts(result);
                }
            } else {
                setUserHasSubs(false);
            }
        } catch (error){
            console.log('Error loading community page:', error);
            setUserHasSubs(false);
        }
    }


    useEffect(()=>{
        if (props.isSignedIn){
            handleLoadHomePage();
        } else if (props.isSignedIn!==null){
            setUserHasSubs(false);
        }
    },[props.isSignedIn]);

    return (
        <React.Fragment>
            {userHasSubs ? 
                <div className='homeContainer'>
                    <div className='pageContentContainer'>
                        <div className='pagePostsContainer'>
                            {posts.slice(0,postLimit).map((post)=>{
                                return <PostCard post={post} key={uuidv4()} handleDeletePost={handleDeletePost}/>
                            })}
                        </div>
                        {props.isSignedIn && userSubs.length>0 && <HomeSidebar userSubs={userSubs}/>}
                    </div>
                </div>
            :
                <CommunityAllPage isHome={true} userHasSubs={userHasSubs}/>
            }
            
        </React.Fragment>
        
    )
}

export default Home;