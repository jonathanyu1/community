import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import firebase, { auth, fs } from '../../Firebase/firebase';
import { v4 as uuidv4 } from 'uuid';

const CreatePost = () => {
    const [isRedirect, setIsRedirect] = useState(false);
    const [communityNames, setCommunityNames] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [imgFileSrc, setImgFileSrc] = useState(null);
    const [imgFileSizeMiB, setImgFileSizeMiB] = useState('');
    // const [imgFileName, setImgFileName] = useState('');
    const [communitySelect, setCommunitySelect] = useState('');
    const [postId, setPostId] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const loadingIcon = <i className="fa fa-spinner" aria-hidden="true"></i>;
    const loadingImgUrl = 'https://www.google.com/images/spin-32.gif?a';

    useEffect(()=>{
        handleLoadCommunityNames();
    },[]);

    const handleLoadCommunityNames = async () => {
        try {
            let tempCommunityNames = await loadCommunityNames();
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
                tempArray.push(doc.id);
            });
            return tempArray;
        }).catch((error)=>{
            console.log('Error getting community names:',error);
        });
        return tempCommunityNames;
    }

    const addPostToFs = () => {
        return fs.collection('communities').doc(communitySelect)
            .collection('posts').add({
                title: title,
                description: description,
                community: communitySelect,
                userCreator: auth().currentUser.displayName,
                userCreatorUid: auth().currentUser.uid,
                createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
                scoreUp: [],
                scoreDown: [],
                commentList: []
            }).catch((error)=>{
                console.log('Error uploading text post:',error);
            });
    }

    const addImgPostToFs = () => {
        return fs.collection('communities').doc(communitySelect)
        .collection('posts').add({
            title: title,
            imgUrl: loadingImgUrl,
            description: description,
            community: communitySelect,
            userCreator: auth().currentUser.displayName,
            userCreatorUid: auth().currentUser.uid,
            createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            scoreUp: [],
            scoreDown: [],
            commentList: []
        }).then(function(postRef){
            setPostId(postRef.id);
            let filePath = auth().currentUser.uid + '/' + postRef.id + '/' + imgFile.name;
            return firebase.storage().ref(filePath).put(imgFile).then(function(fileSnapshot) {
                // Generate a public URL for the file.
                return fileSnapshot.ref.getDownloadURL().then((url) => {
                  // Update the chat message placeholder with the image's URL.
                  return postRef.update({
                    imgUrl: url,
                    storageUri: fileSnapshot.metadata.fullPath
                  });
                });
              });
        }).catch((error)=>{
            console.log('Error uploading post with image:',error);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (imgFile) {
            handleImgSubmit();
        } else {
            handleTextSubmit();
        }
    }

    const handleTextSubmit = () => {
        if (title.length>1){
            addPostToFs()
            .then((data)=>{
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

    const handleImgSubmit = () => {
        if (imgFile && imgFile.type.match('image.*') && imgFileSizeMiB<1){
            addImgPostToFs()
            .then(()=>{
                URL.revokeObjectURL(imgFileSrc);
                setIsRedirect(true);
            })
            .catch((error)=>{
                console.log('Error with creating post:', error);
            });
        } else {
            setErrorMsg('Invalid file upload, please upload a valid image under 1MiB.');
        }
    }

    const handleChangeImage = (e) => {
        if (e.target.files && e.target.files[0]){
            setImgFile(e.target.files[0]);
            setImgFileSrc(URL.createObjectURL(e.target.files[0]));
            setImgFileSizeMiB(e.target.files[0].size/1024/1024);
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
            case 'communityNames':
                setCommunitySelect(e.target.value);
                break;
        }
    }

    return (
        <React.Fragment>
            {isRedirect && postId ? <Redirect to={`/c/${communitySelect}/${postId}`}/> : 
                <div id='createPostContainer'>
                    <form
                        autoComplete="off"
                        onSubmit={handleSubmit}
                        className='createPostForm'
                    >
                        <h1>
                            Create a New Post
                        </h1>
                        <div className='createPostSection'>
                            <label htmlFor='titleInput' className='labelPostTitle'>Add a title: </label>
                            <input
                                id='titleInput'
                                className='titleInput'
                                placeholder="Title"
                                name="title"
                                type="text"
                                onChange={handleChange}
                                value={title}
                                minLength='2'
                                required
                            />
                        </div>
                        <div className='createPostSection'>
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
                        <div>
                            {/* <label htmlFor='createPostImgUpload' className='labelUploadImg'>Upload an image: </label> */}
                            <input 
                                type='file' 
                                accept='image/*'
                                id='createPostImgUpload'
                                onChange={handleChangeImage}
                            />
                            {imgFile && imgFileSrc &&
                                <React.Fragment>
                                    <img src={`${imgFileSrc}`} alt={`${imgFile.name}`} className='imgUploadPreview'/>
                                    {imgFileSizeMiB && 
                                    <p>File size: {`${imgFileSizeMiB.toFixed(2)} MiB`}</p>
                                    }
                                </React.Fragment>
                            }
                        </div>
                        <div className='createPostSection'>
                            <label htmlFor='selectCommunityNames' className='labelPostCommunityNames'>Select a community for your post: </label>
                            {isLoading ? 
                                loadingIcon
                            : 
                                <select 
                                    className='selectCommunityNames'
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
                                                <option value={`${commName}`} key={uuidv4()}>
                                                    {commName}
                                                </option>
                                            )
                                        )
                                    })} 
                                </select>
                            }
                        </div>
                        <div>
                            {errorMsg ? (
                                <p>{errorMsg}</p>
                            ) : null}
                            <button type="submit" className='btnSubmit'>Submit Post</button>
                        </div>
                    </form>
                </div>
            }
        </React.Fragment>
    )
}

export default CreatePost;