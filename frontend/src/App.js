import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreatePaste from './components/CreatePaste';
import ViewPaste from './components/ViewPaste';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <Link to="/" className="logo">Pastebin Lite</Link>
                    <Link to="/">Create New</Link>
                </nav>
                <main>
                    <Routes>
                        <Route path="/" element={<CreatePaste />} />
                        <Route path="/p/:id" element={<ViewPaste />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;