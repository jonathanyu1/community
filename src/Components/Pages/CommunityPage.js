import React, {useEffect, useState} from 'react';
import NotFound from './NotFound';
import { fs } from '../../Firebase/firebase';

const CommunityPage = (props) => {
    const [commExists, setcommExists] = useState(true);


    const handleLoadCommunityPage = async () => {
        try{
            await loadCommunityPagePosts();
            // let tempPosts = await loadCommunityPagePosts();
            // console.log(tempPosts);
        } catch (error){
            console.log('Error loading community page:', error);
        }
    }

    const loadCommunityPagePosts = () => {
        let tempArray = [];
        let docRef = fs.collection('communities').doc(props.match.params.comm);
        // fs.collection('communities').doc(props.match.params.comm)
        docRef.get().then(doc=>{
            if (doc.exists){
                console.log(doc.id);
                docRef.collection('posts').get()
                .then(sub=>{
                    if (sub.docs.length>0){
                        console.log('subcollection posts exists');
                    } else {
                        console.log('subcollection posts does not exist');
                    }
                });
            } else {
                console.log('community does not exist');
                setcommExists(false);
            }
        })
        // let docRef = fs.collection('communities');
        // let tempCommunityNames = docRef.get().then((ref)=>{
        //     ref.forEach((doc)=>{
        //         console.log(doc.id);
        //         tempArray.push(doc.id);
        //     });
        //     return tempArray;
        // }).catch((error)=>{
        //     console.log('Error getting community names:',error);
        // });
        // // setIsLoading(false);
        // return tempCommunityNames;
        
    }

    useEffect(()=>{
        handleLoadCommunityPage();
    },[]);

    // return 404 component if not found
    return (
        <React.Fragment>
            {commExists ? 
                <div id='communityPageProps'>
                    {props.match.params.comm}
                </div>
            :
                <NotFound/>
            }
            
        </React.Fragment>
        
    )
}

export default CommunityPage;