import React, {useState, useEffect} from 'react';
import {fs} from '../Firebase/firebase';
import Comment from './Comment';
import { v4 as uuidv4 } from 'uuid';

const CommentSection = (props) => {
    const [comments, setComments] = useState([]);

    const handleDeleteComment = (docId) => {
        return fs.collection('communities').doc(props.match.params.comm)
                .collection('posts').doc(props.match.params.id)
                .collection('comments').doc(docId).update({
                    userCreator: '[deleted]',
                    userCreatorUid: '[deleted]',
                    description: '[deleted]'
                });
    }

    useEffect(()=>{
        const handleCommentChanges = (snapshot) => {
            let tempArray = [];
            snapshot.docs.forEach((doc)=>{
                tempArray.push(doc.data());
            });
            setComments(tempArray);
        };

        const commentQuery = fs.collection('communities').doc(props.match.params.comm)
                            .collection('posts').doc(props.match.params.id).collection('comments')
                            .orderBy('createdTimestamp', 'desc');

        const unsusbcribe = commentQuery.onSnapshot(handleCommentChanges, err => console.log(err));
            return () => {
                unsusbcribe();
            }
    },[]);

    return (
        <div className='commentSection'>
            <div className='commentSectionTitle'>
                {`All Comments`}
            </div>
            <div className='commentsContainer'>
                {comments && comments.length > 0 && 
                    comments
                    .filter(comment => comment.postParent === props.match.params.id)
                    .map(comment => {
                        let childComments=null;
                        if (comment.uuid){
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