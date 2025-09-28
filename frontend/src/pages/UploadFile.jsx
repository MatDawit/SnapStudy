import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadFile() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    const handleUpload = async (e) => {
      e.preventDefault();
      if (!file) {
          setStatus("Please select a PDF before submitting!");
          return;
      }

      const formData = new FormData();
      formData.append("pdfFile", file);

      setStatus("Uploading...");

      try {
          const response = await fetch("http://localhost:5000/api/upload", {
              method: "POST",
              body: formData
          });

          let data;
          try {
              data = await response.json();
          } catch (jsonErr) {
              console.error("Failed to parse JSON:", jsonErr);
              setStatus("Upload failed: server did not return valid JSON.");
              return;
          }

          console.log("Backend raw response:", data);
          console.log("quiz_deck:", data.quiz_deck);
          console.log("qa_pairs:", data.quiz_deck?.qa_pairs);

          if (!response.ok || !data || !data.success) {
              setStatus("Upload failed: " + (data?.error || "Unknown error"));
              return;
          }

          if (!data.quiz_deck || !Array.isArray(data.quiz_deck.qa_pairs) || data.quiz_deck.qa_pairs.length === 0) {
              setStatus("No flashcards generated from this PDF.");
              return;
          }

          const deckArray = data.quiz_deck.qa_pairs.map((c, i) => ({
              id: i + 1,
              topic: data.quiz_deck.deck_title || "General",
              term: c.practice_question,
              definition: c.answer,
          }));

          console.log("Mapped deck array:", deckArray); // <-- This will log correctly

          setStatus("Upload successful! Redirecting...");
          navigate('/flashcards', { state: { deck: deckArray } });

      } catch (err) {
          console.error("Fetch error:", err);
          setStatus("Upload failed. Please try again.");
      }
};



    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="card shadow-lg p-4" style={{ maxWidth: '900px', width: '90%' }}>
                <h3 className="card-title text-center mb-3">Upload Your PDF</h3>
                <p className="text-center text-muted mb-4">
                    SnapStudy will generate flashcards from your file!
                </p>

                <div className="container mb-3">
                    <label htmlFor="formFile" className="form-label">Upload a PDF file</label>
                    <input 
                        className="form-control" 
                        accept=".pdf"
                        type="file" 
                        id="formFile"
                        onChange={(e) => setFile(e.target.files[0])}  
                    />
                </div>

                <button
                    type="submit"
                    style={{ width: '300px' }}
                    className="btn btn-light d-block mx-auto"
                    onClick={handleUpload}
                >
                    Upload & Generate Flashcards
                </button>

                {status && (
                    <p className="mt-3 text-center text-muted">{status}</p>
                )}
            </div>
        </div>
    );
}
