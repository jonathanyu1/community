import React, {useState} from 'react'

const DeletePrompt = (props) => {
    // need to pass function in props to handle deleting whatever it is
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
                    <div className='deleteWarningYes' onClick={()=>props.deleteFunction(props.id)}>
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