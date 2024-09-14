import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Admin from './components/Admin';
import ClassDetail from './components/ClassDetail';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Student from './components/Student';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/class/:id" element={<ClassDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin key={window.location.pathname} />} />
        <Route path="/student" element={<Student />} />
      </Routes>
    </Router>
  );
}

export default App;