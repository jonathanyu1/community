import React, {useState} from 'react'

const DeletePrompt = (props) => {
    const [showWarning, setShowWarning] = useState(false);

    const handleShowWarning = () => {
        setShowWarning(true);
    }

    const handleHideWarning = () => {
        setShowWarning(false);
    }

    return (
        <React.Fragment>
            {showWarning ? 
                <div className='deleteWarning'>
                    <div className='deleteWarningText'>
                        Are you sure?
                    </div>
                    <div className='deleteWarningYes' 
                        onClick={(props.community ? ()=>props.deleteFunction(props.id, props.community): ()=>props.deleteFunction(props.id))}
                    >
                        Yes
                    </div>
                    {` / `}
                    <div className='deleteWarningNo' onClick={handleHideWarning}>
                        No
                    </div>
                </div>
            :
                <div className='deletePrompt' onClick={handleShowWarning}>
                    Delete
                </div>
            }
        </React.Fragment>
    )
}

export default DeletePrompt;