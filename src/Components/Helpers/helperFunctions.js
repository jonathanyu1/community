import firebase, {fs, auth} from '../../Firebase/firebase';
const defaultPicUrl = 'https://firebasestorage.googleapis.com/v0/b/community-83f47.appspot.com/o/outline_person_black_24dp.png?alt=media&token=b5cd056b-dd16-4e76-8d0f-219039626747';
const storage = firebase.storage();

const deleteOldPic = (url) => {
    console.log(url);
    if (url!==defaultPicUrl){
        let picRef = storage.refFromURL(url);
        picRef.delete()
        .catch((error)=>{
            console.log('Error deleting old img:',error);
        })
    }
}

export function handleDeletePost(id,community){
    console.log(id);
    console.log(community);
    console.log(auth().currentUser.uid);
    let canDelete = false;
    let tempImgUrl = '';
    let docQuery = fs.collection('communities').doc(community).collection('posts').doc(id);
    // get img url if exists, check if user is allowed to delete post
    docQuery.get().then((doc)=>{
        console.log(doc.data());
        if (auth().currentUser && auth().currentUser.uid === doc.data().userCreatorUid){
            console.log('can delete post');
            tempImgUrl = doc.data().imgUrl;
            canDelete = true;
        }
    }).then(()=>{
        // delete post here
        console.log(canDelete);
        console.log(tempImgUrl);
        docQuery.delete().then(()=>{
            console.log('deleted document successfully');
            if (tempImgUrl){
                deleteOldPic(tempImgUrl);
            }
        }).catch((error)=>{
            console.log('Error deleting post:', error);
        })
    }).catch((error)=>{
        console.log('Error fetching post:', error);
    });
}

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

// let rainbowColors = [
//     [255,0,0],
//     [255,127,0],
//     [255,255,0],
//     [0, 255,0],
//     [0,0,255],
//     [46,43,95],
//     [139,0,255]
// ]

// let redColors = [
//     [255,0,0],
//     [255,37,0],
//     [255,74,0],
//     [255,111,0],
//     [255,148,0],
//     [255,185,0],
//     [255,222,0],
//     [255,255,0],
// ]

// let redColorsRepeat = [
//     [255,0,0],
//     [255,37,0],
//     [255,74,0],
//     [255,111,0],
//     [255,148,0],
//     [255,185,0],
//     [255,222,0],
//     [255,255,0],
//     [255,222,0],
//     [255,185,0],
//     [255,148,0],
//     [255,111,0],
//     [255,74,0],
//     [255,37,0],
// ]

// let redToGreenColors = [
//     [255,0,0],
//     [255,73,0],
//     [255,146,0],
//     [255,219,0],
//     [219,255,0],
//     [146,255,0],
//     [73,255,0]
// ]

// let custom = [
//     [255,0,0],
//     [250,128,114],
//     [255,127,0],
//     [255,170,70],
//     [255,217,0],
//     [70, 255, 168],
//     [70,255,240]
// ]

let redToPinkRepeat=[
    [255,0,0],
    [255,63,0],
    [255,127,0],
    [255,122,45],
    [255,117,90],
    [255,112,135],
    [255,105,180],
    [255,112,135],
    [255,117,90],
    [255,122,45],
    [255,127,0],
    [255,63,0],
    [255,0,0],
]

export function colorPickerRgb(index) {
    let colorArr = redToPinkRepeat;
    let color = colorArr[Math.floor(index%colorArr.length)];
    // let color = '';
    // if (index>=colorArr.length){
    //     color = colorArr[colorArr.length-1];
    // } else {
    //     color = colorArr[Math.floor(index%colorArr.length)];
    // }
    let rgbValue = 'rgb(' + color.join(', ') + ')';
    return rgbValue;
}

// export function colorPickerRgb(index){
//     let colorArr = [255,0,0,1];
//     if (index>0){
//         colorArr = [255,0,0,1*(Math.pow(0.8, (index+1)))]
//     }
//     // let colorArr=[255,0,0,1*(Math.pow(0.95, (index+1)))];
//     let rgbaValue = 'rgba(' + colorArr.join(', ') + ')';
//     return rgbaValue;
// }



// rainbowColors = {
//     red: [255,0,0],
//     orange: [255,127,0],
//     yellow: [255,255,0],
//     green: [0, 255,0],
//     blue: [0,0,255],
//     indigo: [46,43,95],
//     violet: [139,0,255]
// }

