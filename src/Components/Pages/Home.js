import React, {useEffect, useState} from 'react';
import CommunityAllPage from './CommunityAllPage';

const Home = (props) => {
    const [userHasSubs, setUserHasSubs] = useState(false);

    const loadHomePagePosts = () => {

    }

    const handleLoadHomePage = async () => {
        try{
            let result = await loadHomePagePosts();
            console.log(result);
            if (result && result.length) {
                console.log('posts exist');
                // setPosts(result);
            }
        } catch (error){
            console.log('Error loading community page:', error);
        }
    }


    useEffect(()=>{
        console.log(props);
        handleLoadHomePage();
    },[]);

    return (
        <React.Fragment>
            {userHasSubs ? 
                <div id='homeContainer'>

                </div>
            :
                <CommunityAllPage isHome={true}/>
            }
            
        </React.Fragment>
        
    )
}

export default Home;