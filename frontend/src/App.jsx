import React, { useState, useEffect } from "react";
import Notes from "./pages/Notes";
import Home from "./pages/Home";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {user ? <Notes user={user} /> : <Home setUser={setUser} />}
    </GoogleOAuthProvider>
  );
}

export default App;
