import './App.css';
import DocumentEditor from './documentEditor';
import { BrowserRouter as Router,Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

/* eslint-disable */
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/*"
          element={<Navigate to={`/document/:${uuidV4()}`} replace />}
      />
      <Route path="/document/:id" element={<DocumentEditor/>}/>
      </Routes>
    </Router>
  );
}

export default App;
