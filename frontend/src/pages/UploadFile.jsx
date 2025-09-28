import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadFile() {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const dummyFlashcards = [
        {
            id: 1,
            topic: "Mathematics",
            term: "Derivative", 
            definition: "The rate of change of a function with respect to its variable"
        },
        {
            id: 2,
            topic: "Physics",
            term: "Velocity",
            definition: "The rate of change of displacement with respect to time"
        }
    ];

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!file) {
            alert("Please select a PDF prior to submitting!");
            return;
        }

        try {
            // Simulate successful upload
            navigate('/flashcards', { 
                state: { 
                    deck: dummyFlashcards 
                } 
            });
        } catch (error) {
            alert('Upload failed. Please try again.');
        }
    };
    
    return (
        <div className="container-fluid p-0">
            <div className="container mb-3">
                <label htmlFor="formFile" className="form-label">Upload a PDF file</label>
                <input 
                    className="form-control" 
                    accept=".pdf"
                    type="file" 
                    id="formFile"
                    onChange={(e) => setFile(e.target.files[0])}  
                />
                <button 
                    type="submit" 
                    className="btn btn-outline-light mt-3"
                    onClick={handleUpload}
                >
                    Upload
                </button>
            </div>
        </div>
    );
}
