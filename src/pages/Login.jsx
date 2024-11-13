import React, { useState } from 'react';
import TextInput from '../components/TextInput';
import Button from '../components/Btn';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CommonModal from '../components/CommonModal';

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

export default function Login({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [navigateTo, setNavigateTo] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    // 로컬에서 사용할 모의 아이디와 비밀번호
    const mockUserId = 'testUser';  // 모의 아이디
    const mockPassword = 'testPassword';  // 모의 비밀번호

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
            // 아이디와 비밀번호가 로컬 데이터와 일치하는지 확인
            if (userId === mockUserId && password === mockPassword) {
                // 로그인 성공 시 토큰 저장
                localStorage.setItem('authToken', 'dummyToken'); // 실제로는 백엔드에서 받은 JWT 토큰을 저장
                setIsAuthenticated(true); // 로그인 성공 시 상태 업데이트

                navigate('/'); // 로그인 성공 시 홈으로 이동
            } else {
                openModal('아이디 또는 비밀번호가 일치하지 않습니다.');
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
