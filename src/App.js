import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Mytrip from "./pages/Mytrip";
import Editor from "./pages/Editor";
import Sharetrip from "./pages/Sharetrip";
import SharetripDetail from "./pages/SharetripDetail";
import Mypage from "./pages/Mypage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FindId from "./pages/FindId";
import FindPassword from "./pages/FindPassword";
import FindIdSuccess from "./pages/FindIdSuccess";
import ResetPassword from "./pages/ResetPassword";
import TripDetailPage from "./pages/TripDetailPage";
import TripDetailEditorPage from "./pages/TripDetailEditorPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const location = useLocation();

  const checkLoginStatus = async () => {
    console.log("Checking login status...");
    try {
      const response = await axios.post("/users/me", {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // accessToken을 Authorization 헤더에 포함
        },
        withCredentials: true,
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error in /users/me request:", error.message);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      checkLoginStatus();
    } else {
      setIsAuthenticated(false);
    }
  }, [location]); // `location` 변경 시 로그인 상태를 재확인

  return (
    <div className="App">
      <Header isAuthenticated={isAuthenticated} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/find/id" element={<FindId />} />
        <Route path="/find/password" element={<FindPassword />} />
        <Route path="/find/id/success" element={<FindIdSuccess />} />
        <Route path="/find/password/reset" element={<ResetPassword />} />

        {/* 로그인 여부와 관계없이 접근 가능한 페이지 */}
        <Route path="/mytrip" element={<Mytrip />} />
        <Route path="/mytrip/editor" element={<Editor />} />
        <Route path="/mytrip/:id" element={<TripDetailPage />} />
        <Route path="/mytrip/editor/:id" element={<TripDetailEditorPage />} />
        <Route path="/shared-itineraries" element={<Sharetrip />} />
        <Route path="/details/:id" element={<SharetripDetail />} />
        <Route path="/mypage/*" element={<Mypage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
