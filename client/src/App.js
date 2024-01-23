import './App.css';
import React ,{useState} from "react"
import DocumentEditor from './documentEditor';
import { BrowserRouter as Router,Routes, Route, Navigate } from "react-router-dom";
import Login from "./login"
import Dashboard from './dashboard';

/* eslint-disable */
function App() {

  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
      <Route path="/*" element={<Login/>}/>
      <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser}/>}/>
      <Route path="/document/:id" element={<DocumentEditor user={user}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
