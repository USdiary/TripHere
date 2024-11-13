import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Mytrip from './pages/Mytrip';
import Editor from './pages/Editor';
import Sharetrip from './pages/Sharetrip';
import SharetripDetail from './pages/SharetripDetail';
import Mypage from './pages/Mypage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FindId from './pages/FindId';
import FindPassword from './pages/FindPassword';
import FindIdSuccess from './pages/FindIdSuccess';
import ResetPassword from './pages/ResetPassword';
import TripDetailPage from './pages/TripDetailPage';
import TripDetailEditorPage from './pages/TripDetailEditorPage';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

function App() {


    // 로그인 상태를 관리하는 상태 변수
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 컴포넌트가 마운트될 때 로컬 스토리지에 토큰이 있으면 로그인 상태를 유지
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) setIsAuthenticated(true);
    }, []);



    return (
        <div className="App">
            <Header
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
            />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/login"
                    element={<Login setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route path="/signup" element={<Signup />} />
                <Route path="/find/id" element={<FindId />} />
                <Route path="/find/password" element={<FindPassword />} />
                <Route path="/find/id/success" element={<FindIdSuccess />} />
                <Route
                    path="/find/password/reset"
                    element={<ResetPassword />}
                />

                {/* 로그인 여부와 관계없이 접근 가능한 페이지 */}
                <Route path="/mytrip" element={<Mytrip />} />
                <Route path="/mytrip/editor" element={<Editor />} />
                <Route path="/mytrip/:id" element={<TripDetailPage />} />
                <Route
                    path="/mytrip/editor/:id"
                    element={<TripDetailEditorPage />}
                />
                <Route path="/shared-itineraries" element={<Sharetrip />} />
                <Route path="/details/:id" element={<SharetripDetail />} />
                <Route path="/mypage/*" element={<Mypage />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
