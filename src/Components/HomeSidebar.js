import React, {useEffect, useState} from 'react';
import SidebarSub from './SidebarSub';
import {fs} from '../Firebase/firebase';
import {Link} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const HomeSidebar = (props) => {
    const [commList, setCommList] = useState([]);

    const loadHomeSidebar = () => {
        let tempArray = [];
        let result = fs.collection('communities').get().then(ref=>{
            ref.forEach((doc)=>{
                tempArray.push(doc.id);
            });
            return tempArray;
        });
        return result;
    }

    const handleLoadHomeSidebar = async () => {
        try{
            let result = await loadHomeSidebar();
            if (result && result.length) {
                setCommList(result);
            }
        } catch (error){
            console.log('Error loading home sidebar:', error);
        }
    }

    useEffect(()=>{
        handleLoadHomeSidebar();
    },[]);

    return (
        <div className='sidebarContainer' id='homeSidebarContainer'>
            <div className='sidebarTitle'>
                Find new Communities!
            </div>
            <br></br>
            <div className='sidebarContent'>
                {commList.map((commName)=>{
                    return (
                        <Link to={`/c/${commName}`} key={uuidv4()}>
                            <div className='sidebarHomeCommName'>
                                {`/c/${commName}`}
                            </div>
                        </Link>
                    )
                })}
            </div>
            {props.userSubs && 
            <div className='sidebarSubsContainer'>
                <br></br>
                <div className='sidebarTitle' id='sidebarSubsTitle'>
                    Your Subscriptions:
                </div>
                <br></br>
                {props.userSubs.map((sub)=>{
                    return (
                    <Link to={`/c/${sub}`} key={uuidv4()}>
                        <SidebarSub sub={sub}/>
                    </Link>
                    )
                })}
            </div>
            }
        </div>
    )
}

export default HomeSidebar;