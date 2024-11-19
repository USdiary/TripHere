import React, { createContext, useContext, useState, useEffect } from 'react';

// AuthContext 생성
const AuthContext = createContext();

// AuthProvider 생성
export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    // 토큰 유효성 확인 함수
    const isTokenValid = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // JWT 디코딩
            const exp = payload.exp * 1000; // 만료 시간 (ms)
            return Date.now() < exp; // 현재 시간과 비교
        } catch (error) {
            console.warn('토큰 유효성 검증 중 오류 발생:', error);
            return false;
        }
    };

    // 초기 상태 확인 (로컬 스토리지에서 토큰 확인)
    useEffect(() => {
        console.log('AuthContext 초기화 중...');
        const storedToken = localStorage.getItem('token');
        if (storedToken && isTokenValid(storedToken)) {
            console.log('유효한 토큰 발견:', storedToken);
            setIsLoggedIn(true);
            setToken(storedToken);
        } else {
            console.log('토큰 없음 또는 만료됨. 로그아웃 처리.');
            setIsLoggedIn(false);
            setToken(null);
            localStorage.removeItem('token');
        }
    }, []);

    // 로그인 함수
    const login = (newToken) => {
        console.log('로그인 실행. 새로운 토큰:', newToken);
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIsLoggedIn(true);
    };

    // 로그아웃 함수
    const logout = async () => {
        try {
            console.log('서버 로그아웃 요청...');
            await logoutUser(); // 서버 로그아웃 API 호출
        } catch (error) {
            console.warn('서버 로그아웃 중 오류 발생:', error);
        } finally {
            console.log('클라이언트 로그아웃 처리.');
            localStorage.removeItem('token');
            setToken(null);
            setIsLoggedIn(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// AuthContext 사용을 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);
