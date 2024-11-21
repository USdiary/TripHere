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
            // 상태 코드가 409일 경우에도 에러로 처리하지 않기
            return { status: response.status, data: responseData }; // 정상적으로 데이터 반환
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
            // 상태 코드가 409일 경우에도 에러로 처리하지 않기
            return { status: response.status, data: responseData }; // 정상적으로 데이터 반환
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
            // 상태 코드가 409일 경우에도 에러로 처리하지 않기
            return { status: response.status, data: responseData }; // 정상적으로 데이터 반환
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
            // 상태 코드가 409일 경우에도 에러로 처리하지 않기
            return { status: response.status, data: responseData }; // 정상적으로 데이터 반환
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
            return { status: response.status, data: responseData }; // 정상적으로 데이터 반환
        }
    } catch (error) {
        console.error(`회원가입 오류: ${error.message}`);
        throw error;
    }
};
