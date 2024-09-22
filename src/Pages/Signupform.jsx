import { useState } from 'react';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom'; 
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

const Signupform = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, { displayName });

      // Send verification email
      await sendEmailVerification(user);

      // Save user information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
      });

      // Clear form fields
      setEmail('');
      setPassword('');
      setDisplayName('');
      setError('');

      // Redirect to a page informing the user to verify their email
      navigate('/verify-email'); // Change this to your desired path
    } catch (err) {
      setError('Failed to create account: ' + err.message);
    }
  };

  return (
    <div className='signup-container'>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className='title'>Create Your <span>Account</span></h2>

        <label htmlFor="displayName">
          Display Name:
          <input 
            type="text" 
            id="displayName" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>

        <label htmlFor="email">
          Email:
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="password">
          Password:
          <input 
            type="password" 
            id="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label htmlFor="rememberMe" className="remember-me-label">
          <input type="checkbox" id="rememberMe" />
          Remember me
        </label>
        
        <button type='submit'>Sign Up</button>

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

        <p className='text'>Already Registered? <Link to='/login'>Login</Link></p>
      </form>
    </div>
  );
};

export default Signupform;
