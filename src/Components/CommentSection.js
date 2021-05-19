import React, {useEffect} from 'react';
import {fs} from '../Firebase/firebase';

const CommentSection = (props) => {

    const handleCommentSnapshot = () => {
        // let docRef = fs.collection('communities').doc('')
    }

    useEffect(()=>{
        console.log(props);
        handleCommentSnapshot();
    },[]);

    return (
        <div className='commentSection'>

        </div>
    )
}

export default CommentSection;