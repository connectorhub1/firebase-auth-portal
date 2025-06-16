import React, { useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleSignup = async () => {
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSignin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message);
    }
  };

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
      <div style={{ maxWidth: 350, margin: "2rem auto", textAlign: "center" }}>
        <h2>Welcome, {user.displayName || user.email}!</h2>
        <button onClick={handleSignout}>Sign out</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 350, margin: "2rem auto", textAlign: "center" }}>
      <h2>Sign In / Sign Up Portal</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        style={{ width: "90%", margin: "6px 0", padding: "8px" }}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        style={{ width: "90%", margin: "6px 0", padding: "8px" }}
        onChange={e => setPassword(e.target.value)}
      />
      <div style={{ margin: "12px 0" }}>
        <button onClick={handleSignin} style={{ marginRight: 8 }}>Sign In</button>
        <button onClick={handleSignup}>Sign Up</button>
      </div>
      <div>
        <button onClick={handleGoogleSignin}>Sign in with Google</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;