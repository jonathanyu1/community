import React, {useState, useEffect} from 'react';
import {fs} from '../Firebase/firebase';
import Comment from './Comment';
import { v4 as uuidv4 } from 'uuid';

const CommentSection = (props) => {
    // const [numComments, setNumComments] = useState(0);
    const [comments, setComments] = useState([]);
    const [topLevelComments, setTopLevelComments] = useState([]);

    const handleDeleteComment = (docId) => {
        console.log(docId);
        console.log(props);
        return fs.collection('communities').doc(props.match.params.comm)
                .collection('posts').doc(props.match.params.id)
                .collection('comments').doc(docId).update({
                    userCreator: '[deleted]',
                    userCreatorUid: '[deleted]',
                    description: '[deleted]'
                });
    }

    useEffect(()=>{
        console.log(props);
        // enableCommentQuerySnapshot();
        // let cloneDeep = require('lodash.clonedeep');
        const handleCommentChanges = (snapshot) => {
            // let commentArray = cloneDeep(comments);
            // console.log(commentArray);
            // snapshot.docChanges().forEach((change)=>{
            //     if (change.type === "added") {
            //         console.log("New comment: ", change.doc.data({ serverTimestamps: 'estimate' }));
            //         commentArray.push(change.doc.data({ serverTimestamps: 'estimate' }));
            //     }
            //     // need to figure out this logic, it triggers due to servertimestamp being updated later https://github.com/EddyVerbruggen/nativescript-plugin-firebase/issues/736
            //     // if (change.type === "modified" && change.doc.data().created) {
            //     //     console.log("Modified comment: ", change.doc.data());
            //     //     console.log(change.doc.data().uuid);
            //     //     let index = commentArray.map(function(e) {return e.uuid}).indexOf(change.doc.data().uuid);
            //     //     console.log(index);
            //     //     commentArray.splice(index,1);
            //     //     commentArray.push(change.doc.data());
            //     // }
            //     if (change.type === "removed") {
            //         console.log("Removed comment: ", change.doc.data());
            //     }
            // });
            // console.log(commentArray);
            // setComments(commentArray);
            let tempArray = [];
            snapshot.docs.forEach((doc)=>{
                tempArray.push(doc.data());
            });
            setComments(tempArray);
        };

        const commentQuery = fs.collection('communities').doc(props.match.params.comm)
                            .collection('posts').doc(props.match.params.id).collection('comments');

        const unsusbcribe = commentQuery.onSnapshot(handleCommentChanges, err => console.log(err));
            return () => {
                unsusbcribe();
            }
    },[]);

    useEffect(()=>{
        console.log(comments);
    },[comments]);

    return (
        <div className='commentSection'>
            <div className='commentSectionTitle'>
                {`All Comments`}
            </div>
            <div className='commentsContainer'>
                {/* top level comments and their children */}
                {comments && comments.length > 0 && 
                    comments
                    .filter(comment => comment.postParent === props.match.params.id)
                    .map(comment => {
                        let childComments=null;
                        if (comment.uuid){
                            console.log('hi');
                            childComments = comments.filter(comm => comment.postId === comm.postParent);
                        }
                        return (
                            <Comment 
                                key={uuidv4()}
                                childComments={childComments}
                                comment={comment}
                                allComments={comments}
                                match={props.match}
                                history={props.history}
                                location={props.location}
                                index={0}
                                handleDeleteComment={handleDeleteComment}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CommentSection;