export const checkIdDuplicate = async (userId) => {
    const url = 'https://www.yeogida.net/users/verify-id';
    const body = { id: userId };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        const responseData = await response.json();
        if (response.ok) {
            return { status: response.status, data: responseData };
        } else {
            throw new Error(responseData.message || 'ID 중복 체크 실패');
        }
    } catch (error) {
        console.error(`ID 중복 체크 오류: ${error.message}`);
        throw error;
    }
};

export const checkPhoneDuplicate = async (phone) => {
    const url = 'https://www.yeogida.net/users/verify-phone';
    const body = { phonenumber: phone };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        const responseData = await response.json();
        if (response.ok) {
            return { status: response.status, data: responseData };
        } else {
            throw new Error(responseData.message || '전화번호 중복 체크 실패');
        }
    } catch (error) {
        console.error(`전화번호 중복 체크 오류: ${error.message}`);
        throw error;
    }
};

export const checkEmailDuplicate = async (email, userName) => {
    const url = 'https://www.yeogida.net/users/signup-sendnum';
    const body = { email, name: userName };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        const responseData = await response.json();
        if (response.ok) {
            return { status: response.status, data: responseData };
        } else {
            throw new Error(
                responseData.message || '이메일 인증번호 요청 실패'
            );
        }
    } catch (error) {
        console.error(`이메일 인증번호 요청 오류: ${error.message}`);
        throw error;
    }
};

export const verifyCertificationCode = async (email, code) => {
    const url = 'https://www.yeogida.net/users/verify-number';
    const body = { email: String(email).trim(), code: String(code).trim() };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        const responseData = await response.json();
        if (response.ok) {
            return { status: response.status, data: responseData };
        } else {
            throw new Error(responseData.message || '인증번호 확인 실패');
        }
    } catch (error) {
        console.error(`인증번호 확인 오류: ${error.message}`);
        throw error;
    }
};

export const signUp = async (userData) => {
    const url = 'https://www.yeogida.net/users/signup';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData),
        });

        const responseData = await response.json();
        if (response.ok) {
            return { status: response.status, data: responseData };
        } else {
            throw new Error(responseData.message || '회원가입 실패');
        }
    } catch (error) {
        console.error(`회원가입 오류: ${error.message}`);
        throw error;
    }
};
