import React, {useState} from 'react';
import firebase, { auth, fs } from '../../Firebase/firebase';
import {Redirect} from 'react-router-dom';

const CreateCommunity = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(''); 
    const [errorMsg, setErrorMsg] = useState('');
    const [isRedirect, setIsRedirect] = useState('');

    const addCommunityToFs = () => {
        return fs.collection('communities').doc(title.toLowerCase()).set({
            description: description || 'Set a description!',
            userCreator: auth().currentUser.displayName,
            userCreatorUid: auth().currentUser.uid,
            createdTimestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    const checkAvailableTitle = () => {
        let tempAvail = true;
        let docRef = fs.collection('communities');
        let avail = docRef.get().then((ref)=>{
            ref.forEach((doc)=>{
                if (doc.id.toLowerCase()===title.toLowerCase()){
                    tempAvail = false;
                }
            });
            return tempAvail;
        }).catch((error)=>{
            console.log('Error checking title:', error);
            return false;
        });
        return avail;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (title.length>2 && title.length<20){
            checkAvailableTitle().then((result)=>{
                if (result){
                    addCommunityToFs()
                    .then(()=>{
                        setIsRedirect(true);
                    })
                    .catch ((error)=>{
                            console.log('Error with sign up:',error);
                            setErrorMsg(error.message);
                    });
                } else {
                    setErrorMsg('That title is not available, please choose another one.');
                }
            });
        } else {
            setErrorMsg('That title is too short, please enter a title with atleast 3 characters and less than 20 characters.');
        }
        
    }

    const handleChange = (e) => {
        switch (e.target.name){
            case 'title':
                // setTitle(e.target.value.replace(/\s/g, ''));
                setTitle(e.target.value.replace(/[!@#$%^&*(),.?":{}[|<>/`'_\s\\]/g, ''));
                break;
            case 'description':
                setDescription(e.target.value);
                break;
        }
    }

    return (
        <React.Fragment>
            {isRedirect ? <Redirect to={`/c/${title.toLowerCase()}`}/> : 
                <div id='createCommunityContainer'>
                    <form
                        autoComplete="off"
                        onSubmit={handleSubmit}
                        className='createCommunityForm'
                    >
                        <h1>
                            Create a New Community
                        </h1>
                        <div>
                            <input
                                placeholder="Title"
                                className='createCommunityTitleInput'
                                name="title"
                                type="text"
                                onChange={handleChange}
                                value={title}
                                minLength='3'
                                maxLength='20'
                            />
                        </div>
                        <div>
                            <textarea
                                className='descriptionInput createCommunityTextArea'
                                placeholder="Description"
                                name="description"
                                onChange={handleChange}
                                value={description}
                            />
                        </div>
                        <div>
                            {errorMsg ? (
                                <p>{errorMsg}</p>
                            ) : null}
                            <button className='btnSubmit'type="submit">Submit Community</button>
                        </div>
                    </form>
                </div>
            }
        </React.Fragment>
    )
}

export default CreateCommunity;