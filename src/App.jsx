import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import "./app.css";

// Firebase configuration
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  const handleSignIn = () => {
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Error signing in:", error);
      setError("Failed to sign in. Please try again.");
    });
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  // Function to extract Google Drive ID from URL
  const extractDriveId = (url) => {
    if (!url) return null;
    
    if (url.includes("drive.google.com")) {
      if (url.includes("/file/d/")) {
        const parts = url.split("/file/d/");
        if (parts.length > 1) {
          return parts[1].split("/")[0];
        }
      } else if (url.includes("id=")) {
        const idParam = url.split("id=")[1];
        return idParam.split("&")[0];
      } else if (url.includes("/open?id=")) {
        return url.split("/open?id=")[1];
      }
    }
    
    const regex = /[-\w]{25,}/;
    const match = url.match(regex);
    return match ? match[0] : null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setSheetData({});
      setError("");

      if (currentUser) {
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 3000);

        setLoading(true);
        try {
          const res = await fetch(
            `https://script.google.com/macros/s/AKfycbwxpUD2FVQKVhFYX2rSg4b4sqtEcZ9YuMcxfimok6sJWvAx4VYlScl-QwbiHb5My6xK-g/exec?email=${currentUser.email}`
          );
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          
          if (data.error) {
            setError(data.error);
          } else {
            setSheetData(data);
          }
        } catch (error) {
          console.error("Error fetching sheet data:", error);
          setError("Failed to load user data. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <div className="bubbles"></div>

      {/* Welcome Popup */}
      {showWelcome && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 215, 0, 0.9)',
          color: '#000',
          padding: '10px 20px',
          borderRadius: '10px',
          zIndex: 100,
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          fontWeight: 'bold',
          animation: 'fadeOut 3s forwards'
        }}>
          Welcome Islamic Bayan!
        </div>
      )}

      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          background: "rgba(255, 215, 0, 0.05)",
          border: "1px solid rgba(255, 215, 0, 0.3)",
          borderRadius: "20px",
          padding: "30px",
          textAlign: "center",
          color: "white",
          boxShadow: "0 0 40px rgba(255, 215, 0, 0.2)",
          marginTop: "10vh",
          marginBottom: "20px",
          overflowY: "auto",
          maxHeight: "85vh",
        }}
      >
        {error && <div style={{ color: "#ff5252", marginBottom: "15px" }}>{error}</div>}
        
        {user ? (
          <>
            <div style={{ position: 'relative', marginBottom: "30px" }}>
              {/* Profile picture at top right */}
              {sheetData.profilePicture && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #ffd700",
                  boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)",
                }}>
                  {sheetData.profilePicture ? (
                    (() => {
                      const driveId = extractDriveId(sheetData.profilePicture);
                      const imageUrl = driveId 
                        ? `https://lh3.googleusercontent.com/d/${driveId}=s200` 
                        : sheetData.profilePicture;
                      
                      return (
                        <img
                          src={imageUrl}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            if (driveId) {
                              e.target.src = `https://drive.google.com/uc?export=view&id=${driveId}`;
                            } else {
                              e.target.parentNode.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ffd700;font-size:12px">Image</div>';
                            }
                          }}
                        />
                      );
                    })()
                  ) : (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#ffd700",
                      backgroundColor: 'rgba(0,0,0,0.2)'
                    }}>
                      N/A
                    </div>
                  )}
                </div>
              )}
              
              <div style={{ textAlign: 'center' }}>
                <img
                  src="/logo.png"
                  alt="Islamic Bayan"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "2px solid #ffd700",
                    marginBottom: "10px",
                    objectFit: "cover",
                  }}
                />
                <h2 style={{ color: "#ffd700", fontWeight: "bold", fontSize: "1.8rem" }}>Welcome,</h2>
                <h3 style={{ color: "#ffd700", marginBottom: "10px", fontSize: "1.4rem" }}>
                  Islamic Bayan
                </h3>
              </div>
            </div>

            {loading ? (
              <div style={{ margin: "20px 0", color: "#ffd700" }}>
                Loading user data...
              </div>
            ) : (
              <div style={{ textAlign: "left", marginBottom: "20px" }}>
                <div style={{ 
                  backgroundColor: 'rgba(255,215,0,0.1)', 
                  padding: '15px', 
                  borderRadius: '10px',
                  marginBottom: '15px'
                }}>
                  <h3 style={{ color: "#ffd700", borderBottom: '1px solid #ffd700', paddingBottom: '5px' }}>Personal Information</h3>
                  <p><strong>Full Name:</strong> {sheetData.fullName || user.displayName}</p>
                  <p><strong>Email:</strong> {user.email || "N/A"}</p>
                  <p><strong>Whatsapp:</strong> {sheetData.whatsappContact || "N/A"}</p>
                  <p><strong>Date of Birth:</strong> {sheetData.dateOfBirth || "N/A"}</p>
                  <p><strong>CNIC:</strong> {sheetData.cnicNumber || "N/A"}</p>
                </div>
                
                <div style={{ 
                  backgroundColor: 'rgba(255,215,0,0.1)', 
                  padding: '15px', 
                  borderRadius: '10px',
                  marginBottom: '15px'
                }}>
                  <h3 style={{ color: "#ffd700", borderBottom: '1px solid #ffd700', paddingBottom: '5px' }}>Address</h3>
                  <p>{sheetData.address || "N/A"}</p>
                </div>
                
                <div style={{ 
                  backgroundColor: 'rgba(255,215,0,0.1)', 
                  padding: '15px', 
                  borderRadius: '10px',
                  marginBottom: '15px'
                }}>
                  <h3 style={{ color: "#ffd700", borderBottom: '1px solid #ffd700', paddingBottom: '5px' }}>Professional Details</h3>
                  <p><strong>Business Role:</strong> {sheetData.businessRole || "N/A"}</p>
                  <p><strong>Availability:</strong> {sheetData.availability || "N/A"}</p>
                  <p><strong>Available Hours:</strong> {sheetData.availabilityFrom} - {sheetData.availabilityTo}</p>
                  <p><strong>Portfolio:</strong> 
                    {sheetData.portfolio ? (
                      <a href={sheetData.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#ffd700', marginLeft: '5px' }}>
                        View Portfolio
                      </a>
                    ) : " N/A"}
                  </p>
                  <p><strong>Languages:</strong> {sheetData.languages || "N/A"}</p>
                  <p><strong>Social Media:</strong> 
                    {sheetData.socialMedia ? (
                      <a href={sheetData.socialMedia} target="_blank" rel="noopener noreferrer" style={{ color: '#ffd700', marginLeft: '5px' }}>
                        View Profile
                      </a>
                    ) : " N/A"}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="button"
              style={{ marginTop: "15px", width: '100%' }}
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className="button"
            style={{ width: '100%' }}
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
