import PropTypes from 'prop-types';
import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './Context/AuthContext'; // Ensure the correct path

import Signupform from './Pages/Signupform';
import Login from './Pages/Login';
import Home from './Pages/Home';
import VerifyEmail from './Pages/VerifyEmail'; // Import the verification page

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />; // Redirect to login if not authenticated
    }
    return children; // Render the child components (protected content)
  };

  // Define prop types for ProtectedRoute
  ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            currentUser ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        <Route path="/signup" element={<Signupform />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} /> {/* Add this route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
