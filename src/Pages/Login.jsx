import { useState } from 'react';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom'; 
import { auth } from '../firebase'; // Make sure this points to your firebase config file
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Use useNavigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      setEmail(''); // Reset the email field
      setPassword(''); // Reset the password field
      navigate('/home'); // Redirect to homepage after successful login
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        window.alert('Incorrect password. Please try again.');
      } else {
        window.alert('Failed to login: ' + err.message);
      }
      setEmail(''); // Clear the email field after error
      setPassword(''); // Clear the password field after error
    }
  };

  return (
    <div className='signup-container'>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className='title'>Welcome <span>Back</span></h2>
        
        <label htmlFor="email">
          Email:
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label htmlFor="password">
          Password:
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label htmlFor="rememberMe" className="remember-me-label">
          <input type="checkbox" id="rememberMe" />
          Remember me
        </label>
        
        <button type='submit'>Login</button>

        <p>
          Forgot your password? <a href="/forgot-password">Click here</a>
        </p>
        
        <div className="social-login">
          <div className="or-container">
            <span className="line"></span>
            <span className="or-box">OR</span>
            <span className="line"></span>
          </div>
          <div className="social-icons">
            <a href="/facebook-auth" className="social-icon"><FaFacebookF /></a>
            <a href="/google-auth" className="social-icon"><FcGoogle /></a>
            <a href="/linkedin-auth" className="social-icon"><FaLinkedinIn /></a>
          </div>
        </div>

        <p className='text'>Need an account? <Link to='/signup'>Signup</Link></p>
      </form>
    </div>
  );
}

export default Login;
