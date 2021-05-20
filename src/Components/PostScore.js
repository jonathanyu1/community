import React, {useState, useEffect} from 'react';
import {fs, auth} from '../Firebase/firebase';

const PostScore = (props) => {
    const [score, setScore] = useState(null);
    const [isUpvote, setIsUpvote] = useState(false);
    const [isDownvote, setIsDownvote] = useState(false);
    const [currUser, setCurrUser] = useState(auth().currentUser.uid || null);

    const handleUpvoteClick = () => {
        let docRef = fs.collection('communities').doc(props.community).collection('posts').doc(props.postId);
        docRef.get().then((doc)=>{
            console.log(doc.data());
            let tempScoreUp = doc.data().scoreUp;
            let tempScoreDown = doc.data().scoreDown;
            if (tempScoreUp.indexOf(currUser)===-1){
                // user hasnt upvoted previously, add to scoreUp array
                if (tempScoreDown.indexOf(currUser)!==-1){
                    // previously downvoted, remove from it
                    tempScoreDown.splice(tempScoreDown.indexOf(currUser), 1);
                }
                if (currUser) {tempScoreUp.push(currUser)};
                docRef.update({
                    scoreUp: tempScoreUp,
                    scoreDown: tempScoreDown
                });
            } else {
                // user has upvoted previously, remove from scoreUp array
                tempScoreUp.splice(tempScoreUp.indexOf(currUser), 1);
                docRef.update({
                    scoreUp: tempScoreUp,
                });
            }
        });
    }

    const handleDownvoteClick = () => {
        let docRef = fs.collection('communities').doc(props.community).collection('posts').doc(props.postId);
        docRef.get().then((doc)=>{
            console.log(doc.data());
            let tempScoreUp = doc.data().scoreUp;
            let tempScoreDown = doc.data().scoreDown;
            if (tempScoreDown.indexOf(currUser)===-1){
                // user hasnt upvoted previously, add to scoreUp array
                if (tempScoreUp.indexOf(currUser)!==-1){
                    // previously downvoted, remove from it
                    tempScoreUp.splice(tempScoreUp.indexOf(currUser), 1);
                }
                if (currUser) {tempScoreDown.push(currUser)};
                docRef.update({
                    scoreUp: tempScoreUp,
                    scoreDown: tempScoreDown
                });
            } else {
                // user has upvoted previously, remove from scoreUp array
                tempScoreDown.splice(tempScoreDown.indexOf(currUser), 1);
                docRef.update({
                    scoreDown: tempScoreDown,
                });
            }
        });
    }

    const enablePostQuerySnapshot = () => {
        const postQuery = fs.collection('communities').doc(props.community).collection('posts').doc(props.postId);
        postQuery.onSnapshot((doc)=>{
            if (doc.data().scoreUp.indexOf(currUser)!==-1){
                // user is upvoting this post
                setIsUpvote(true);
                setIsDownvote(false);
            } else if (doc.data().scoreDown.indexOf(currUser)!==-1){
                setIsUpvote(false);
                setIsDownvote(true);
            } else {
                setIsUpvote(false);
                setIsDownvote(false);
            }
            let tempScore=Number(doc.data().scoreUp.length) - Number(doc.data().scoreDown.length);
            setScore(tempScore);
        });
    }

    useEffect(()=>{
        console.log(props);
        // need props.community, props.postId
        enablePostQuerySnapshot();
    },[]);

    return (
        <React.Fragment>
            <span className={`material-icons-outlined ${isUpvote?'activeUpvote':''}`} id='thumbUp' onClick={handleUpvoteClick}>
                thumb_up
            </span>
            <span className={`postCardScore ${isUpvote?'activeUpvote':''} ${isDownvote?'activeDownvote':''}`}>{score}</span>
            <span className={`material-icons-outlined ${isDownvote?'activeDownvote':''}`} id='thumbDown' onClick={handleDownvoteClick}>
                thumb_down
            </span>
        </React.Fragment>
    )
}

export default PostScore;