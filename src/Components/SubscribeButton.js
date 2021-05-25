import React, {useState, useEffect} from 'react';
import firebase, {fs, auth} from '../Firebase/firebase';

const SubscribeButton = (props) => {
    const [userSubs, setUserSubs] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const getUserSubscribeStatus = () => {
        let userRef = fs.collection('users').doc(auth().currentUser.uid);
        let result = userRef.get().then((doc)=>{
            if (doc.exists){
                console.log(doc.data());
                return doc.data().communitySubs || [];
            } else {
                return null;
            }
        }).catch((error)=>{
            console.log('Error fetching user subs:', error);
            return null;
        });
        return result;
    }

    const handleFetchUserData = async () => {
        if (props.isSignedIn) {
            let tempUserSubs = await getUserSubscribeStatus();
            console.log(tempUserSubs);
            if (tempUserSubs !== null){
                setUserSubs(tempUserSubs);
            }
        }
    }

    useEffect(()=>{
        console.log((userSubs.indexOf(props.title) ===-1 ? false : true));
        setIsSubscribed((userSubs.indexOf(props.title) ===-1 ? false : true))
    },[userSubs]);

    useEffect(()=>{
        handleFetchUserData();
    },[]);

    const handleSubscribe = () => {
        fs.collection('users').doc(auth().currentUser.uid).update({
            communitySubs: firebase.firestore.FieldValue.arrayUnion(props.title),
        }).then(()=>{
            let tempUserSubs = [...userSubs, props.title];
            setUserSubs(tempUserSubs);
        }).catch((error)=>{
            console.log('Error updating subscription:', error);
        });
    }

    const handleUnsubscribe = () => {
        fs.collection('users').doc(auth().currentUser.uid).update({
            communitySubs: firebase.firestore.FieldValue.arrayRemove(props.title),
        }).then(()=>{
            let tempUserSubs = [...userSubs];
            tempUserSubs = tempUserSubs.filter(sub => sub !== props.title);
            setUserSubs(tempUserSubs);
        }).catch((error)=>{
            console.log('Error updating subscription:', error);
        });
    }

    return (
        <React.Fragment>
            {isSubscribed ?
            <button
                className='btnUnsubscribeComm'
                onClick={handleUnsubscribe}
            >
                Unsubscribe
            </button> 
            : 
            <button
                className='btnSubscribeComm'
                onClick={handleSubscribe}
            >
                Subscribe
            </button>
            }
            
        </React.Fragment>
        
    )
}

export default SubscribeButton;