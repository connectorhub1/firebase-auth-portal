import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import "./App.css";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOUvPz5GUz-hf4G0f9cVPmAX2pphdwRtg",
  authDomain: "authportal-74915.firebaseapp.com",
  projectId: "authportal-74915",
  storageBucket: "authportal-74915.firebasestorage.app",
  messagingSenderId: "42499454353",
  appId: "1:42499454353:web:1f59c0b6938681ff249630",
  measurementId: "G-4XBXDB6TTZ"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const [sheetData, setSheetData] = useState({});

  const handleSignIn = () => {
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Error signing in:", error);
    });
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const res = await fetch(
            `https://script.google.com/macros/s/AKfycbwxpUD2FVQKVhFYX2rSg4b4sqtEcZ9YuMcxfimok6sJWvAx4VYlScl-QwbiHb5My6xK-g/exec?email=${currentUser.email}`
          );
          const data = await res.json();
          setSheetData(data);
        } catch (error) {
          console.error("Error fetching sheet data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <div className="bubbles"></div>

      <div
        style={{
          maxWidth: "400px",
          margin: "auto",
          background: "rgba(255, 215, 0, 0.05)",
          border: "1px solid rgba(255, 215, 0, 0.3)",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center",
          color: "white",
          boxShadow: "0 0 40px rgba(255, 215, 0, 0.2)",
          marginTop: "10vh",
        }}
      >
        {user ? (
          <>
            <div style={{ marginBottom: "20px" }}>
              <img
                src="/logo.png"
                alt="Islamic Bayan"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "2px solid #ffd700",
                  marginBottom: "10px",
                  objectFit: "cover",
                }}
              />
              <h2 style={{ color: "#ffd700", fontWeight: "bold" }}>Welcome,</h2>
              <h3 style={{ color: "#ffd700", marginBottom: "10px" }}>
                Islamic bayan
              </h3>
            </div>

            <div style={{ textAlign: "left", marginBottom: "20px" }}>
              <p>
                <strong>Full Name:</strong>{" "}
                {sheetData.name || user.displayName}
              </p>
              <p>
                <strong>Whatsapp:</strong> {sheetData.whatsapp || "N/A"}
              </p>
              <p>
                <strong>Profile Picture:</strong>
              </p>

              {sheetData.profilePicture || sheetData.picture ? (
                (() => {
                  const imageURL =
                    sheetData.profilePicture || sheetData.picture;
                  let finalImageURL = imageURL;
                  if (imageURL?.includes("drive.google.com")) {
                    const match = imageURL.match(/[-\w]{25,}/);
                    if (match) {
                      finalImageURL = `https://drive.google.com/uc?export=view&id=${match[0]}`;
                    }
                  }
                  return (
                    <img
                      src={finalImageURL}
                      alt="Profile"
                      style={{
                        width: "180px",
                        height: "180px",
                        borderRadius: "25px",
                        marginTop: "10px",
                        objectFit: "cover",
                        border: "3px solid #ffd700",
                        boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
                      }}
                    />
                  );
                })()
              ) : (
                <p>N/A</p>
              )}
            </div>

            <button
              onClick={handleSignOut}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ffd700",
                color: "#000",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(255, 215, 0, 0.2)",
              }}
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ffd700",
              color: "#000",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 8px rgba(255, 215, 0, 0.2)",
            }}
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
