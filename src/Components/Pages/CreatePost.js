import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import firebase, { auth, fs } from '../../Firebase/firebase';

const CreatePost = (props) => {
    const [isRedirect, setIsRedirect] = useState(false);
    const [communityNames, setCommunityNames] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [imgFileSrc, setImgFileSrc] = useState(null);
    // const [imgFileName, setImgFileName] = useState('');
    const [communitySelect, setCommunitySelect] = useState('');
    const [postId, setPostId] = useState('');
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

    const addPostToFs = () => {
        // return fs.collection('communities').doc(title).set({
        //     description: description || 'Set a description!',
        //     userCreator: auth().currentUser.displayName,
        //     userCreatorUid: auth().currentUser.uid,
        //     createdTimestamp: firebase.firestore.FieldValue.serverTimestamp()
        // });
        console.log(communitySelect);
        return fs.collection('communities').doc(communitySelect)
            .collection('posts').add({
                title: title,
                description: description,
                community: communitySelect,
                userCreator: auth().currentUser.displayName,
                userCreatorUid: auth().currentUser.uid,
                createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
                scoreUp: [],
                scoreDown: []
            });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (title.length>1){
            console.log('hi');
            addPostToFs()
            .then((data)=>{
                URL.revokeObjectURL(imgFileSrc);
                console.log(data.id);
                setPostId(data.id);
                setIsRedirect(true);
            })
            .catch((error)=>{
                console.log('Error with creating post:', error);
            });
        } else {
            setErrorMsg('That title is too short, please enter a title with atleast 2 characters.');
        }
    }

    const handleChange = (e) => {
        console.log(e.target.name);
        switch (e.target.name){
            case 'title':
                setTitle(e.target.value);
                break;
            case 'description':
                setDescription(e.target.value);
                break;
            case 'communityNames':
                console.log(e.target.value);
                setCommunitySelect(e.target.value);
                break;
        }
    }

    const handleChangeImage = (e) => {
        if (e.target.files && e.target.files[0]){
            console.log(e);
            console.log(e.target.name);
            console.log(e.target.value);
            console.log(e.target.files);
            console.log(e.target.files[0]);
            console.log(e.target.files[0].name);
            setImgFile(e.target.files[0]);
            setImgFileSrc(URL.createObjectURL(e.target.files[0]));
            // setImgFileName(e.target.files[0].name);
        }
    }

    return (
        <React.Fragment>
            {isRedirect && postId ? <Redirect to={`/c/${communitySelect}/${postId}`}/> : 
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
                        <div>
                            {/* <label htmlFor='createPostImgUpload' className='labelUploadImg'>Upload an image: </label> */}
                            <input 
                                type='file' 
                                accept='image/*'
                                id='createPostImgUpload'
                                onChange={handleChangeImage}
                            />
                            {imgFile && imgFileSrc &&
                                <img src={`${imgFileSrc}`} alt={`${imgFile.name}`} className='imgUploadPreview'/>
                            }
                        </div>
                        </div>
                            <label htmlFor='selectCommunityNames' className='labelPostCommunityNames'>Select a community for your post: </label>
                            {isLoading ? 
                                loadingIcon
                            : 
                                <select 
                                    name='communityNames' 
                                    id='selectCommunityNames'
                                    value={communitySelect}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" defaultValue disabled hidden>Choose here</option>
                                    {communityNames.map((commName)=>{
                                        return (
                                            (commName === 'all' ? 
                                                null 
                                            :
                                                <option value={`${commName}`}>
                                                    {commName}
                                                </option>
                                            )
                                        )
                                    })} 
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