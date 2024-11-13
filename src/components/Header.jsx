import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/yeogida_logo.png';
import Bell from '../components/Bell';
import Button from '../components/Btn';
import CommonModal from '../components/CommonModal';
import { logoutUser } from '../api/Logout/LogoutApi';

const HeaderStyle = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    img {
        cursor: pointer;
    }
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 1280px;
    height: 70px;
    flex-shrink: 0;
`;

const NavBox = styled.div`
    width: auto;
    height: 35px;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-left: 100px;
    color: #000;
    font-family: NanumGothic;
    font-size: 16px;
    font-weight: 600;
`;

const Btnstyle = styled.div`
    padding: 0 10px;
    margin-left: 50px;
`;

const MyPageContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #333;

    &:hover {
        color: #59abe6;
    }
`;

const StyledDropdown = styled.div`
    width: 270px;
    position: absolute;
    top: 30px;
    box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 10px 0;
`;

const DropdownMenu = styled.div`
    width: 100%;
    font-size: 16px;
    padding: 20px 0 20px 20px;
    color: black;
    cursor: pointer;

    &:hover {
        background-color: #f6f6f6;
        font-weight: bold;
    }
`;

export const Nav = styled.nav`
    ul {
        list-style: none;
        display: flex;
        padding: 0;
        margin: 0;
    }
    li {
        width: 80px;
        padding: 8px 25px;
        cursor: pointer;
        color: #333333;
    }
    li:hover {
        color: #59abe6;
    }
`;

export default function Header({ isAuthenticated, setIsAuthenticated }) {
    const [viewDropdown, setViewDropdown] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [navigateTo, setNavigateTo] = useState('');
    const [modalType, setModalType] = useState(1); // 모달 타입 상태 추가

    const navigate = useNavigate();

    // 로그아웃 핸들러 (실제 로그아웃 동작)
    const handleConfirmLogout = () => {
        localStorage.removeItem('authToken'); // 로컬 스토리지에서 토큰 삭제
        setIsAuthenticated(false); // 로그인 상태를 로그아웃으로 변경
        navigate('/login'); // 로그인 페이지로 이동
    };

    // 로그아웃 버튼 클릭 시 모달 열기
    const handleLogout = () => {
        setModalMessage('로그아웃 하시겠습니까?'); // 모달 메시지 설정
        setModalType(2);
        setIsModalOpen(true); // 모달 열기
    };

    // 모달
    const openModal = (message, navigateToPage = '') => {
        setModalMessage(message);
        setNavigateTo(navigateToPage);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleProtectedNavigation = (path) => {
        if (isAuthenticated) {
            navigate(path);
        } else {
            setModalMessage('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
            setModalType(1);
            setNavigateTo('/login'); // 로그인 페이지로 리다이렉트
            setIsModalOpen(true); // 모달 열기
        }
    };

    // 드롭다운 메뉴 보이기/숨기기
    useEffect(() => {
        let timeout;
        if (!isHovered && viewDropdown) {
            timeout = setTimeout(() => setViewDropdown(false), 300);
        } else if (isHovered) {
            setViewDropdown(true);
            if (timeout) clearTimeout(timeout);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [isHovered, viewDropdown]);

    return (
        <header>
            <HeaderStyle>
                <HeaderContainer>
                    <span className="logo" onClick={() => navigate('/')}>
                        <img
                            style={{ width: '111px', height: '50px' }}
                            src={logo}
                            alt="로고"
                        />
                    </span>
                    <NavBox>
                        <Nav>
                            <ul>
                                <li
                                    onClick={() =>
                                        handleProtectedNavigation('/mytrip')
                                    }
                                >
                                    나의여행
                                </li>
                                <li
                                    onClick={() =>
                                        navigate('/shared-itineraries')
                                    }
                                >
                                    여행공유
                                </li>
                                <li>
                                    <MyPageContainer
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        마이페이지
                                        {viewDropdown && (
                                            <StyledDropdown>
                                                <DropdownMenu
                                                    onClick={() =>
                                                        handleProtectedNavigation(
                                                            '/mypage/userinfo'
                                                        )
                                                    }
                                                >
                                                    회원정보 관리
                                                </DropdownMenu>
                                                <DropdownMenu
                                                    onClick={() =>
                                                        handleProtectedNavigation(
                                                            '/mypage/friend'
                                                        )
                                                    }
                                                >
                                                    친구목록
                                                </DropdownMenu>
                                                <DropdownMenu
                                                    onClick={() =>
                                                        handleProtectedNavigation(
                                                            '/mypage/scrap'
                                                        )
                                                    }
                                                >
                                                    스크랩
                                                </DropdownMenu>
                                            </StyledDropdown>
                                        )}
                                    </MyPageContainer>
                                </li>
                            </ul>
                        </Nav>
                    </NavBox>
                    <Bell />
                    <Btnstyle>
                        {isAuthenticated ? (
                            <Button
                                onClick={handleLogout}
                                width="110px"
                                height="50px"
                                borderColor="#59abe6"
                                backgroundColor="#59abe6"
                                hoverBackgroundColor="#0D90EE"
                                hoverBorderColor="#0D90EE"
                                borderRadius="10px"
                                fontSize="16px"
                                text="로그아웃"
                            />
                        ) : (
                            <Button
                                onClick={() => navigate('/login')}
                                width="110px"
                                height="50px"
                                borderColor="#59abe6"
                                backgroundColor="#59abe6"
                                hoverBackgroundColor="#0D90EE"
                                hoverBorderColor="#0D90EE"
                                borderRadius="10px"
                                fontSize="16px"
                                text="로그인"
                            />
                        )}
                    </Btnstyle>
                    <CommonModal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        title={modalMessage}
                        type={modalType} // 모달 타입 설정
                        onConfirm={handleConfirmLogout} // 확인 시 로그아웃 함수 실행
                    />
                </HeaderContainer>
            </HeaderStyle>
        </header>
    );
}
