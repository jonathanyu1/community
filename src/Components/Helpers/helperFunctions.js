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

let rainbowColors = [
    [255,0,0],
    [255,127,0],
    [255,255,0],
    [0, 255,0],
    [0,0,255],
    [46,43,95],
    [139,0,255]
]

let redColors = [
    [255,0,0],
    [255,37,0],
    [255,74,0],
    [255,111,0],
    [255,148,0],
    [255,185,0],
    [255,222,0],
    [255,255,0],
]

let redToGreenColors = [
    [255,0,0],
    [255,73,0],
    [255,146,0],
    [255,219,0],
    [219,255,0],
    [146,255,0],
    [73,255,0]
]

export function colorPickerRgb(index) {
    let colorArr = redToGreenColors;
    let color = colorArr[Math.floor(index%colorArr.length)];
    let rgbValue = 'rgb(' + color.join(', ') + ')';
    return rgbValue;
}



// rainbowColors = {
//     red: [255,0,0],
//     orange: [255,127,0],
//     yellow: [255,255,0],
//     green: [0, 255,0],
//     blue: [0,0,255],
//     indigo: [46,43,95],
//     violet: [139,0,255]
// }

