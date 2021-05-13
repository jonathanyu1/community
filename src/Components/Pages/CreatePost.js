import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import { fs } from '../../Firebase/firebase';

const CreatePost = (props) => {
    const [isRedirect, setIsRedirect] = useState(false);
    const [communityNames, setCommunityNames] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const loadingIcon = <i className="fa fa-spinner" aria-hidden="true"></i>;

    useEffect(()=>{
        // setCommunityNames(loadCommunityNames());
        handleLoadCommunityNames();
    },[]);

    const handleLoadCommunityNames = async () => {
        try {
            let tempCommunityNames = await loadCommunityNames();
            console.log(tempCommunityNames);
            setCommunityNames(tempCommunityNames);
            setIsLoading(false);
        }catch (error){
            console.log('error:',error);
        }
    }
    
    const loadCommunityNames = () => {
        let tempArray = [];
        let docRef = fs.collection('communities');
        let tempCommunityNames = docRef.get().then((ref)=>{
            ref.forEach((doc)=>{
                console.log(doc.id);
                tempArray.push(doc.id);
            });
            return tempArray;
        }).catch((error)=>{
            console.log('Error getting community names:',error);
        });
        // setIsLoading(false);
        return tempCommunityNames;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (title.length>2){
            console.log('hi');
            // checkAvailableTitle().then((result)=>{
            //     console.log(result);
            //     if (result){
            //         addCommunityToFs()
            //         .then(()=>{
            //             setIsRedirect(true);
            //         })
            //         .catch ((error)=>{
            //                 console.log('Error with sign up:',error);
            //                 console.log(error.message);
            //                 setErrorMsg(error.message);
            //         });
            //     } else {
            //         setErrorMsg('That title is not available, please choose another one.');
            //     }
            // });
        } else {
            setErrorMsg('That title is too short, please enter a title with atleast 1 character.');
        }
    }

    const handleChange = (e) => {
        switch (e.target.name){
            case 'title':
                setTitle(e.target.value);
                break;
            case 'description':
                setDescription(e.target.value);
                break;
        }
    }

    return (
        <React.Fragment>
            {isRedirect ? <Redirect to='/'/> : 
                <div id='createPostContainer'>
                    <form
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <h1>
                            Create a New Post
                        </h1>
                        <div>
                            <label htmlFor='titleInput' className='labelPostTitle'>Add a title: </label>
                            <input
                                id='titleInput'
                                className='titleInput'
                                placeholder="Title"
                                name="title"
                                type="text"
                                onChange={handleChange}
                                value={title}
                                minLength='0'
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor='descriptionInput' className='labelPostDescription'>Add a description: </label>
                            <textarea
                                id='descriptionInput'
                                className='descriptionInput'
                                placeholder="Description"
                                name="description"
                                onChange={handleChange}
                                value={description}
                            />
                        </div>
                            <label htmlFor='selectCommunityNames' className='labelPostCommunityNames'>Select a community for your post: </label>
                            {isLoading ? 
                                loadingIcon
                            : 
                                <select name='communityNames' id='selectCommunityNames'>
                                        {/* {communityNames.} */}
                                </select>
                            }
                        <div>
                            {errorMsg ? (
                                <p>{errorMsg}</p>
                            ) : null}
                            <button type="submit">Submit Post</button>
                        </div>
                    </form>
                </div>
            }
        </React.Fragment>
    )
}

export default CreatePost;