import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Archives from './Archives';
import Navbar from '../components/Navbar';
import UploadFile from './UploadFile';
import About from './About';
import Flashcards from './Flashcards';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../styles/App.css';

// export default function App() {
//   const location = useLocation();
//   const isHome = location.pathname === '/';

//   return (
//     <div className="cover-page d-flex flex-column min-vh-100 text-white text-center">

//       {/* NavBar */}
//       <Navbar />

//       {/* Page Content */}
//       <main className="cover-container container d-flex flex-column justify-content-center flex-grow-1">
//       <TransitionGroup component={null}>
//           <CSSTransition
//             key={location.pathname}
//             classNames="fade"
//             timeout={500}
//           >
//             <div className="fade-wrapper">
//               <Routes location={location}>
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/archives" element={<Archives />} />
//                 <Route path="/uploadfile" element={<UploadFile />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/flashcards" element={<Flashcards />} />
//               </Routes>
//             </div>
//           </CSSTransition>
//         </TransitionGroup>
//       </main>

//       {/* Footer */}
//       <footer className="mastfoot mt-auto py-3">
//         <div className="container">
//           <p>© HackUMBC 2024</p>
//         </div>
//       </footer>
//     </div>
//   );
// }


export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-wrapper d-flex flex-column min-vh-100">

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className={isHome ? "cover-page d-flex justify-content-center align-items-center" : "regular-page"}>
        <TransitionGroup component={null}>
          <CSSTransition
            key={location.pathname}
            classNames="fade"
            timeout={500}
          >
            <div className={isHome ? "cover-page d-flex justify-content-center align-items-center" : "fade-wrapper"}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/archives" element={<Archives />} />
                  <Route path="/uploadfile" element={<UploadFile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/flashcards" element={<Flashcards />} />
                </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>

      {/* Footer */}
      <footer className="mastfoot mt-auto py-3">
        <div className="container">
          <p>© HackUMBC 2025</p>
        </div>
      </footer>
    </div>
  );
}

// Home page component
function HomePage() {
  return (
    <>
      {/* <h1 className="cover-heading display-4">Snap Study</h1> */}
      <h1 className="glowy-text-animated">Snap Study</h1>
      <p className="lead">
        Snap. Study. Succeed!
      </p>
      <p className="lead">
        Say goodbye to boring study sessions! With SnapStudy, just upload your PDFs and watch them magically turn into flashcards. Perfect for cramming, quiz prep, or just flexing your brainpower. 
        Learn faster, remember more, and make studying actually… fun.
      </p>
      <p className="lead">
        <a href="#" className="btn btn-lg btn-light">Learn more</a>
      </p>
    </>
  );
}
