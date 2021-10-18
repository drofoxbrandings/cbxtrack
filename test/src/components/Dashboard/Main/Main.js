import React, { useState } from 'react'
import axios from 'axios'

const Main = () => {

    const [emailData, setEmailData] = useState()

    const handleSubmit = () => {
        axios.post('http://localhost:5000/api/checkEmailExists/', emailData).then(response => {

            console.log(response)
        }
        )
    }
    const handleChange = (e) => {
        setEmailData(e.target.value)
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input name="email" id="email" value={emailData} onChange={handleChange} />
                <button type="submit">Try</button>
            </form>
        </div>
    )
}

export default Main
