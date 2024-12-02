export const checkAccountExists = async (userName, email) => {
    try {
        const response = await fetch(
            'https://www.yeogida.net/users/idpw-sendnum',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name: userName, email: email }),
            }
        );

        if (response.status === 200) return true;
        if (response.status === 404)
            throw new Error(
                '가입 시 입력하신 회원 정보와 맞는지 다시 한번 확인해주세요.'
            );

        throw new Error(
            '서버 에러가 발생했습니다. \n나중에 다시 시도해주세요.'
        );
    } catch (error) {
        console.error('Check account request failed:', error);
        throw error;
    }
};

export const sendVerificationCode = async (
    userName,
    email,
    certificationNum
) => {
    try {
        const response = await fetch('https://yeogida.net/users/find/id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                name: userName,
                email: email,
                code: certificationNum,
            }),
        });

        const data = await response.json();
        console.log('Verification response:', data); // 응답 데이터 콘솔에 출력

        if (!response.ok) {
            throw new Error(data.message || '인증 요청에 실패했습니다.');
        }

        return data;
    } catch (error) {
        console.error('Verification code request failed:', error);
        throw error;
    }
};

export const fetchUserId = async () => {
    try {
        const response = await fetch('https://yeogida.net/api/findId', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok)
            throw new Error('서버에서 아이디를 가져오지 못했습니다.');

        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error('Fetch user ID request failed:', error);
        throw error;
    }
};

export const resendCodeAPI = async (email, userName) => {
    try {
        const response = await fetch('https://yeogida.net/users/idpw-sendnum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, name: userName }),
        });

        if (!response.ok)
            throw new Error('서버 오류가 발생했습니다. 다시 시도해주세요.');

        return '인증번호가 재전송되었습니다.';
    } catch (error) {
        console.error('Resend code request failed:', error);
        throw error;
    }
};
