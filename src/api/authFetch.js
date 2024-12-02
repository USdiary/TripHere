import { useAuth } from '../context/AuthContext';

export const authFetch = async (url, options = {}) => {
    const { token } = useAuth();  // AuthContext에서 token 가져오기
    const defaultHeaders = {
        'Authorization': `Bearer ${token}`, // Authorization 헤더에 token 포함
        'Content-Type': 'application/json',
    };

    const fetchOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers, // 기존 헤더와 병합
        },
        credentials: 'include', // 쿠키 포함
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        console.error(`HTTP Error: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};