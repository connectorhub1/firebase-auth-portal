import React, { useState } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  React.useEffect(() => {
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
          <svg
            viewBox="0 0 48 48"
            width="24"
            height="24"
            style={{ marginRight: 8 }}
          >
            <g>
              <path
                fill="#4285F4"
                d="M24 9.5c3.54 0 6.31 1.54 7.77 2.84l5.71-5.71C33.97 3.51 29.37 1.5 24 1.5 14.85 1.5 6.99 7.83 3.68 16.23l6.98 5.42C12.39 15.06 17.74 9.5 24 9.5z"
              />
              <path
                fill="#34A853"
                d="M46.13 24.55c0-1.63-.14-3.18-.41-4.67H24v9.09h12.42c-.54 2.9-2.18 5.35-4.7 7.04l7.16 5.56C43.32 37.91 46.13 31.87 46.13 24.55z"
              />
              <path
                fill="#FBBC05"
                d="M10.66 28.82c-1.02-2.97-1.02-6.17 0-9.14l-6.98-5.42C1.06 17.32 0 20.54 0 24c0 3.46 1.06 6.68 2.68 9.74l6.98-5.42z"
              />
              <path
                fill="#EA4335"
                d="M24 46.5c5.95 0 10.94-1.96 14.59-5.36l-7.16-5.56c-2 1.4-4.64 2.23-7.43 2.23-6.26 0-11.61-5.56-12.34-12.92l-6.98 5.42C6.99 40.17 14.85 46.5 24 46.5z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </g>
          </svg>
          Sign in with Google
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default App;
