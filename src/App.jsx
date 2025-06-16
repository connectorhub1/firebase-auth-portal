import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleGoogleSignin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSignout = async () => {
    setError("");
    try {
      await signOut(auth);
    } catch (e) {
      setError(e.message);
    }
  };

  if (user) {
    return (
      <div className="container">
        <div className="card">
          <img
            className="avatar"
            src={user.photoURL || "https://i.imgur.com/0y0y0y0.png"}
            alt="User"
          />
          <h2>Welcome,</h2>
          <h3>{user.displayName || user.email}</h3>
          <button className="button" onClick={handleSignout}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Google logo"
          className="google-logo"
        />
        <h2>Sign In With Google</h2>
        <button className="button google-btn" onClick={handleGoogleSignin}>
          Sign in with Google
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default App;