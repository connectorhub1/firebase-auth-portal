import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [sheetData, setSheetData] = useState(null);

  const loginSound = new Audio("/login.mp3");
  const logoutSound = new Audio("/logout.mp3");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetch(
        `https://script.google.com/macros/s/AKfycbwxpUD2FVQKVhFYX2rSg4b4sqtEcZ9YuMcxfimok6sJWvAx4VYlScl-QwbiHb5My6xK-g/exec?email=${encodeURIComponent(user.email)}`
      )
        .then((res) => res.json())
        .then((data) => {
          setSheetData(data);
          console.log("Fetched Google Sheet data:", data);
        })
        .catch((err) => {
          console.error("Error fetching data from Google Sheet:", err);
        });
    }
  }, [user]);

  const handleGoogleSignin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      loginSound.play();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSignout = async () => {
    setError("");
    try {
      await signOut(auth);
      logoutSound.play();
      setSheetData(null);
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

          {sheetData && !sheetData.error && (
            <div style={{ marginTop: "1rem", textAlign: "left" }}>
              <p><strong>Full Name:</strong> {sheetData.fullName || "N/A"}</p>
              <p><strong>Whatsapp:</strong> {sheetData.whatsapp || "N/A"}</p>
              <p><strong>Profile Picture:</strong></p>
              {sheetData.profilePicture ? (
                <img
                  src={sheetData.profilePicture.replace("open?id=", "uc?export=view&id=")}
                  alt="Profile"
                  style={{ width: "120px", borderRadius: "10px", marginTop: "5px" }}
                />
              ) : (
                <p>N/A</p>
              )}
            </div>
          )}

          {sheetData?.error && (
            <p className="error" style={{ marginTop: "1rem" }}>
              {sheetData.error}
            </p>
          )}

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
