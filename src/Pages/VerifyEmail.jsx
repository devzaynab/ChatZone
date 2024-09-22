 const VerifyEmail = () => {
  return (
    <div className="verifycontainer">
      <div className="verifycard">
      <h2 className='verifytext'>Email Verification</h2>
      <p className='verifypara'>
        A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account.
      </p>
      <button className="verifybutton">Resend Verification Email</button>
      <a href="/login" className="link">Go to Login</a>
      </div>
    </div>
  );
};
  
  export default VerifyEmail;
  