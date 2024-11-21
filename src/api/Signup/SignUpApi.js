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

        // API 명세서에 따른 응답 처리
        if (response.ok) {
            // 성공(200)
            return {
                status: responseData.status, // 200
                message: responseData.message, // "사용할 수 있는 아이디입니다."
                checkedId: responseData.checkedId, // 사용 가능한 아이디
            };
        } else if (response.status === 409) {
            // 실패(409) - 이미 사용 중인 아이디
            return {
                status: responseData.status, // 409
                message: responseData.message, // "이미 사용 중인 아이디입니다."
                checkedId: responseData.checkedId, // 사용 중인 아이디
            };
        } else {
            // 서버 오류 또는 기타 오류 처리
            throw new Error(responseData.message || 'ID 중복 체크 실패');
        }
    } catch (error) {
        console.error(`ID 중복 체크 오류: ${error.message}`);
        throw error; // 오류는 호출자에게 전달
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
            // 성공(200)
            return {
                status: responseData.status, // 200
                message: responseData.message, // "사용할 수 있는 아이디입니다."
                checkedPhone: responseData.checkedPhone, // 사용 가능한 아이디
            };
        } else if (response.status === 409) {
            // 실패(409) - 이미 사용 중인 아이디
            return {
                status: responseData.status, // 409
                message: responseData.message, // "이미 사용 중인 아이디입니다."
                checkedPhone: responseData.checkedPhone, // 사용 중인 아이디
            };
        } else {
            // 서버 오류 또는 기타 오류 처리
            throw new Error(responseData.message || 'Phone 중복 체크 실패');
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
        } else if (response.status === 409) {
            return { status: response.status, data: responseData };
        } else {
            throw new Error(responseData.message || 'email 중복 체크 실패');
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
        } else if (response.status === 400) {
            return { status: response.status, data: responseData };
        } else if (response.status === 404) {
            return { status: response.status, data: responseData };
        } else {
            throw new Error(responseData.message || 'ID 중복 체크 실패');
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
        } else if (response.status === 409) {
            return { status: response.status, data: responseData };
        } else {
            throw new Error(responseData.message || '회원가입 실패');
        }
    } catch (error) {
        console.error(`회원가입 오류: ${error.message}`);
        throw error;
    }
};
