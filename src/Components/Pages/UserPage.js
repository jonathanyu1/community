import React, {useEffect, useState} from 'react';
import {fs} from '../../Firebase/firebase';
import PostCard from '../PostCard';
import NotFound from './NotFound';
import { v4 as uuidv4 } from 'uuid';
import UserSidebar from '../UserSidebar';
import {handleDeletePost} from '../Helpers/helperFunctions';

const UserPage = (props) => {
    const [userExists, setUserExists] = useState(true);
    const [postLimit, setPostLimit] = useState(10);
    const [posts, setPosts] = useState([]);
    const [userDescription, setUserDescription] = useState('');
    const [userSince, setUserSince] = useState('');
    const [userPhotoUrl, setUserPhotoUrl] = useState('');
    const defaultPhotoUrl = 'https://firebasestorage.googleapis.com/v0/b/community-83f47.appspot.com/o/outline_person_black_24dp.png?alt=media&token=b5cd056b-dd16-4e76-8d0f-219039626747';

    useEffect(()=>{
        handleLoadUserPage();
    },[]);

    const loadUserPageInfo = (userUid) => {
        fs.collection('users').doc(userUid).get().then(doc=>{
            if (doc.exists){
                setUserDescription((doc.data().description ? doc.data().description : 'This user has not set a description.'));
                setUserSince((doc.data().createdTimestamp ? doc.data().createdTimestamp.seconds : ''));
                setUserPhotoUrl((doc.data().photoURL ? doc.data().photoURL : defaultPhotoUrl));
            } else {
                console.log('user does not exist');
                setUserExists(false);
            }
        });
    }
    
    const fetchUserUid = () => {
        let tempResult = null;
        let result = fs.collection('users').where('displayName', '==',props.match.params.id)
            .get()
            .then((querySnapshot)=>{
                querySnapshot.forEach((doc)=>{
                    tempResult = doc.data().uid;
                });
                return tempResult;
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
        return result;
    }

    const handleLoadUserPage = async () => {
        try{
            let userUid = await fetchUserUid();
            await loadUserPageInfo(userUid);
            let result = await loadUserPagePosts(userUid);
            if (result && result.length) {
                setPosts(result);
            }
        } catch (error){
            setUserExists(false);
            console.log('Error loading user page:', error);
        }
    }
    
    const loadUserPagePosts = (userUid) => {
        let tempArray = [];
        let tempPosts = fs.collectionGroup('posts').where('userCreatorUid', '==', `${userUid}`).orderBy('createdTimestamp', 'desc').limit(postLimit);
        let result = tempPosts.get().then((querySnapshot)=>{
            let index=0;
            querySnapshot.forEach((doc)=>{
                tempArray.push(doc.data());
                tempArray[index].postId=doc.id; 
                index++;
            });
            return tempArray;
        });
        return result;
    }

    return (
        <React.Fragment>
            {userExists ? 
            <div className='pageContainer' id='userPageContainer'>
                <div className='pageContentContainer' id='userPageContentContainer'>
                    {posts.length ? 
                        <div className='pagePostsContainer'>
                            {posts.map((post)=>{
                                return <PostCard post={post} key={uuidv4()} handleDeletePost={handleDeletePost}/>
                            })}
                        </div>
                    : 
                        <div className='pageEmptyContainer'>
                            This user has not made any posts.
                        </div>
                    }
                    <UserSidebar userDescription={userDescription} userSince={userSince} userPhotoUrl={userPhotoUrl} match={props.match}/>
                </div>
            </div>
            :
            <NotFound/>
            }
        </React.Fragment>
    )
}

export default UserPage;