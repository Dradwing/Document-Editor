import React from 'react';

export default function Login() {
  const loginWithGoogle = () => {
    window.location.href = "/auth/google"; 
  }

  return (
    <div className="login-page">
      <button className='login-with-google-btn' onClick={loginWithGoogle}>
        Sign In With Google
      </button>
    </div>
  );
}
