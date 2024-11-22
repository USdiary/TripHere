import React, { useEffect, useState } from 'react';
import { useLocation, Route, Routes } from 'react-router-dom'; // BrowserRouter 제거
import { AuthProvider } from './context/AuthContext'; // AuthProvider 추가
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Mytrip from './pages/Mytrip/Mytrip';
import { PlaceProvider } from './pages/Mytrip/PlaceContext';
import Editor from './pages/Mytrip/Editor';
import Sharetrip from './pages/Sharetrip';
import SharetripDetail from './pages/SharetripDetail';
import Mypage from './pages/Mypage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FindId from './pages/FindId';
import FindPassword from './pages/FindPassword';
import FindIdSuccess from './pages/FindIdSuccess';
import ResetPassword from './pages/ResetPassword';
import TripDetailPage from './pages/Mytrip/TripDetailPage';
import TripDetailEditorPage from './pages/Mytrip/TripDetailEditorPage';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <Header /> {/* AuthContext를 사용하는 Header */}
                <ScrollToTop /> {/* ScrollToTop 컴포넌트 */}

                <PlaceProvider>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/find/id" element={<FindId />} />
                        <Route path="/find/password" element={<FindPassword />} />
                        <Route
                            path="/find/id/success"
                            element={<FindIdSuccess />}
                        />
                        <Route
                            path="/find/password/reset"
                            element={<ResetPassword />}
                        />
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
                </PlaceProvider>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;
