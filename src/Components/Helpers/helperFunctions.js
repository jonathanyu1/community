import {fs} from '../../Firebase/firebase';

export function calcTimeSincePosted(timeInSecs) {
    let currTime = Math.floor(Date.now()/1000);
    let diff = currTime-timeInSecs;
    if (diff>31536000){
        // post in years
        let time = Math.floor(diff/31536000);
        return `${time} year${time>1?'s':''}`
    } else if (diff>2628000){
        // post in months
        let time = Math.floor(diff/2628000);
        return `${time} month${time>1?'s':''}`
    } else if (diff>604800){
        // post in weeks
        let time = Math.floor(diff/604800);
        return `${time} week${time>1?'s':''}`
    } else if (diff>86400){
        // post in days
        let time = Math.floor(diff/86400);
        return `${time} day${time>1?'s':''}`
    } else if (diff>3600){
        // post in hours
        let time = Math.floor(diff/3600);
        return `${time} hour${time>1?'s':''}`;
    } else if (diff>60){
        // post in minutes
        let time = Math.floor(diff/60);
        return `${time} minute${time>1?'s':''}`;
    } else {
        // post in seconds
        return `${diff} seconds`
    }
}