import React, {useState, useEffect} from 'react';

const TextArea = (props) => {
    // required props: handleSubmitComment that takes an input
    const [commentInput, setCommentInput] = useState('');

    const handleSubmit = () => {
        props.handleSubmitComment(commentInput);
        setCommentInput('');
    }

    const handleCommentInput = (e) => {
        setCommentInput(e.target.value);
    }

    useEffect(()=>{
        if (props.defaultText){
            setCommentInput(props.defaultText);
        }
    },[]);

    return (
        <React.Fragment>
            <textarea
                value={commentInput}
                onChange={handleCommentInput}
                placeholder='Comment here!'
                className={`${props.textAreaClassName}`}
                required
            >
            </textarea>
            {props.children}
            <button
                className={`${props.btnClassName}`}
                // onClick={()=>{props.handleSubmitComment(commentInput)}}
                onClick={handleSubmit}
                id={props.btnId}
            >
                Submit
            </button>
        </React.Fragment>
        
    )
}

export default TextArea;