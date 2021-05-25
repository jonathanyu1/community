import React, {useState, useEffect} from 'react';
import firebase, {auth, fs} from '../../Firebase/firebase';
import {Redirect} from 'react-router-dom';

const Settings = (props) => {
    const [oldImg, setOldImg] = useState('');
    const [imgFile, setImgFile] = useState(null);
    const [imgFileSrc, setImgFileSrc] = useState(null);
    const [imgFileSizeMiB, setImgFileSizeMiB] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [description, setDescription] = useState('');
    const [isRedirect, setIsRedirect] = useState(false);

    const updateUserImg = () => {
        let filePath = auth().currentUser.uid + '/' + 'profilePic' + '/' + imgFile.name;
        return firebase.storage().ref(filePath).put(imgFile).then(function(fileSnapshot) {
            // Generate a public URL for the file.
            return fileSnapshot.ref.getDownloadURL().then((url) => {
                // Update the chat message placeholder with the image's URL.
                return fs.collection('users').doc(auth().currentUser.uid).update({
                    photoURL: url,
                    photoStorageUri: fileSnapshot.metadata.fullPath,
                    description: description
                });
            });
        }).catch((error)=>{
            console.log('Error uploading user info with iamge:', error);
            setErrorMsg('Error uploading user info with iamge.');
        });
    }

    const updateUserDescription = () => {
        return fs.collection('users').doc(auth().currentUser.uid).update({
                description: description,
            }).catch((error)=>{
                console.log('Error fetching and updating user description:', error);
            });
    }

    const handleTextSubmit = () => {
        if (description.length && description.length>0){
            console.log('text submit');
            updateUserDescription()
            .then(()=>{
                setIsRedirect(true);
            })
            .catch((error)=>{
                console.log('Error with updating user description:', error);
            });
        } else {
            setErrorMsg('Description cannot be empty.');
        }
    }

    const handleImgTextSubmit = () => {
        if (imgFile && imgFile.type.match('image.*') && imgFileSizeMiB<1){
            console.log('img submit');
            updateUserImg()
            .then(()=>{
                URL.revokeObjectURL(imgFileSrc);
                // setPostId(data.id);
                console.log(props.profilePicUrl);
                props.deleteOldPic(props.profilePicUrl);
                setIsRedirect(true);
            })
            .catch((error)=>{
                console.log('Error with updating user info:', error);
            });
        } else {
            setErrorMsg('Invalid file upload, please upload a valid image under 1MiB.');
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (imgFile){
            console.log('imgFile');
            handleImgTextSubmit();
        } else {
            console.log('text upload only');
            handleTextSubmit();
        }
    }

    const handleChangeImage = (e) => {
        if (e.target.files && e.target.files[0]){
            console.log(e.target.files[0].type.match('image.*'));
            console.log(e.target.files[0]);
            console.log(`${e.target.files[0].size/1024/1024} MiB`);
            setImgFile(e.target.files[0]);
            setImgFileSrc(URL.createObjectURL(e.target.files[0]));
            setImgFileSizeMiB(e.target.files[0].size/1024/1024);
            // setImgFileName(e.target.files[0].name);
        }
    }

    const handleChange = (e) => {
        setDescription(e.target.value);
    }
    

    useEffect(()=>{
        console.log(props);
        setDescription(props.userDescription);
    },[]);

    return (
        <React.Fragment>
            {isRedirect ? <Redirect to={`/user/${auth().currentUser.displayName}`}/> : 
                <div className='settingsContainer'>
                    <form
                        className='settingsForm'
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        <div className='settingsHeader'>
                            Change Settings
                        </div>
                        <div className='userImgForm'>
                            {(imgFile && imgFileSrc) ?
                                <img src={`${imgFileSrc}`} alt={`${imgFile.name}`} className='userImgUploadPreview'/>
                                :
                                <img
                                    src={props.profilePicUrl}
                                    alt='profilePic'
                                    className='userImgUploadPreview'
                                />
                            }
                            <input 
                                type='file' 
                                accept='image/*'
                                id='userPicImgUpload'
                                onChange={handleChangeImage}
                            />
                            {imgFileSizeMiB && 
                            <p>File size: {`${imgFileSizeMiB.toFixed(2)} MiB`}</p>
                            }
                        </div>
                        <div className='userDescriptionForm'>
                            <label htmlFor='userDescriptionInput' className='labelUserDescription'>Edit description: </label>
                            <textarea
                                className='userDescriptionInput'
                                placeholder="Description"
                                name="description"
                                onChange={handleChange}
                                value={description}
                                maxLength='1000'
                            />
                        </div>
                        {errorMsg ? (
                            <p>{errorMsg}</p>
                        ) : null}
                        <button
                            type='submit'
                            className='btnSettingsSubmit'
                        >
                            Submit
                        </button>
                    </form>
                </div>
            }
        </React.Fragment>
    )
}

export default Settings;