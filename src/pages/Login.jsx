import React, { useState } from 'react';
import TextInput from '../components/TextInput';
import Button from '../components/Btn';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CommonModal from '../components/CommonModal';
import { loginUser } from '../api/Login/LoginApi';
import { useAuth } from '../context/AuthContext';

const LoginForm = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80vh;
    padding: 20px;
    flex-direction: column;
    margin-top: 150px;
    margin-bottom: 100px;
    box-sizing: border-box;
`;

const TitleStyle = styled.h3`
    margin-bottom: 55px;
    font-weight: bold;
    font-size: 36px;
    display: flex;
`;

const LoginInput = styled.div`
    display: flex;
    flex-direction: column;
    width: 490px;
`;

const LinkContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    margin-bottom: 30px;
`;

const Link = styled.span`
    cursor: pointer;
    color: #000;

    &:hover {
        color: #59abe6;
    }
`;

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth(); // Context의 login 함수 가져오기
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [navigateTo, setNavigateTo] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const openModal = (title, navigateToPage = '') => {
        setModalTitle(title);
        setNavigateTo(navigateToPage);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        if (userId && password) {
            try {
                console.log('로그인 요청 시작');
                console.log('입력된 아이디:', userId);
                console.log('입력된 비밀번호:', password);

                // API 요청 및 응답 처리
                const { response, status, responseData } = await loginUser(
                    userId,
                    password
                );

                if (response) {
                    // 로그인 성공 시 토큰 저장 및 상태 업데이트
                    const token = responseData.token;
                    // 서버에서 반환된 JWT 토큰
                    login(token); // Context에 저장
                    window.location.replace('/');
                } else if (status === 401) {
                    // 인증 실패
                    openModal('아이디 또는 비밀번호가 일치하지 않습니다.');
                } else {
                    // 기타 오류
                    openModal(
                        '로그인 중 문제가 발생했습니다.다시 시도해주세요.'
                    );
                }
            } catch (error) {
                console.error('Login request failed:', error);
                openModal('서버와의 연결에 문제가 발생했습니다.');
            }
        } else {
            openModal('아이디와 비밀번호를 입력해주세요.');
        }
    };

    return (
        <LoginForm>
            <TitleStyle>로그인</TitleStyle>
            <LoginInput>
                <TextInput
                    type="text"
                    id="userId"
                    placeholder="아이디"
                    height="80px"
                    marginbottom="15px"
                    autoFocus
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <TextInput
                    type="password"
                    id="password"
                    placeholder="비밀번호"
                    height="80px"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <LinkContainer>
                    <Link onClick={() => navigate('/find/id')}>
                        아이디 찾기
                    </Link>
                    <div>&ensp;|&ensp;</div>
                    <Link onClick={() => navigate('/find/password')}>
                        비밀번호 찾기
                    </Link>
                </LinkContainer>
                <Button
                    onClick={handleLogin}
                    width="490px"
                    height="80px"
                    borderColor="#59ABE6"
                    backgroundColor="#59ABE6"
                    hoverBackgroundColor="#0D90EE"
                    hoverBorderColor="#0D90EE"
                    borderRadius="10px"
                    fontSize="26px"
                    text="로그인"
                    style={{ marginBottom: '15px' }}
                />
                <Button
                    onClick={() => navigate('/signUp')}
                    width="490px"
                    height="80px"
                    borderRadius="10px"
                    fontSize="26px"
                    borderColor="#59ABE6"
                    backgroundColor="white"
                    hoverBackgroundColor="#59ABE6"
                    hoverBorderColor="#59ABE6"
                    color="#59ABE6"
                    text="회원가입"
                />
            </LoginInput>
            <CommonModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                title={modalTitle}
                navigateTo={navigateTo}
            />
        </LoginForm>
    );
}
