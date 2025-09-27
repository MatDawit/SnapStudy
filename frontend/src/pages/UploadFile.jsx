
import React, { useState } from 'react';
// import './UploadFile.css';

export default function UploadFile() {
    const [file, setFile] = useState(null);

    const handleUpload = (e) => {
        if (!file) {
            alert("Please select a PDF prior to submitting!")
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file); 

        

    };

    return(
    <div className="container-fluid p-0">

        {/* Form submit */}
        <div className="container mb-3">
            <label htmlFor="formFile" className="form-label">Upload a PDF file</label>
            <input 
                className="form-control" 
                accept=".pdf"
                type="file" 
                id="formFile"
                onChange={(e) => setFile(e.target.files[0])}  
                />
            <button type="submit" className="btn btn-outline-light mt-3">
                Upload
            </button>
        </div>
    </div>
    );
}