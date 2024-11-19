import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import searchIcon from '../assets/icons/search_icon.png';
import addIcon from '../assets/icons/friend_add_icon.png';
import slashIcon from '../assets/icons/slash_icon.png';
import deleteIcon from '../assets/icons/delete_friend_icon.png';
import approveIcon from '../assets/icons/approve_request_icon.png';
import rejectIcon from '../assets/icons/reject_request_icon.png';
import useDebounce from '../assets/hooks/useDebounce';
import SortDropdown from '../components/SortDropdown';
import CommonModal from '../components/CommonModal';
import { getFriendList, getFriendRequest, getSearchedFriend, deleteFriend, fetchFriendRequestAccept, fetchFriendRequestReject, fetchAddFriend } from '../api/Mypage/friendAPI';

const HeaderStyle = styled.div `
    margin-top: 150px;
    margin-bottom: 50px;
    font-weight: bold;
    font-size: 40px;
    display: flex;
    justify-content: center;
`;

const ArticleStyle = styled.div `
    margin-bottom: 100px;
    position: relative;
    // 원래는 274px
`;

const SearchBarStyle = styled.div `
    position: relative;
    width: 360px;
    margin: 0 auto 75px;

    input {
        width: 100%;
        height: 51px;
        padding-left: 40px;
        padding-right: 165px;
        border: 1px solid #707070;
        border-radius: 8px;
        font-size: 16px;
        box-sizing: border-box;

        &::placeholder {
            color: #707070;
        }

        &:focus {
            outline: none;
        }

        &::-webkit-search-cancel-button {
            -webkit-appearance: none;
            appearance: none;
        }
    }
`;

const LeftContent = styled.span `
    position: absolute;
    top: 55%;
    left: 10px;
    transform: translateY(-50%);
    color: #707070;

    img {
        width: 100%;
        height: 100%;
    }
`;

const RightContent = styled.div `
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    color: #707070;
    display: flex;
    align-items: center;

    span {
        margin-right: 5px;
        margin-bottom: 3px;
        font-size: 18px;
    }

    img {
        width: 27px;
        height: 27px;
        cursor: pointer;
    }
`;

const MiniNavStyle = styled.div `
    width: 494px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    margin-top: 80px;
`;

const MiniMenuStyle = styled.div `
    display: flex;
    align-items: center;

    img {
        width: 15px;
        height: 25px;
        margin: 0 3px;
    }
`;

const MiniMenuBtn = styled.button `
    color: ${(props) => (props.selected ? "#59abe6" : "#000")};
    font-weight: ${(props) => (props.selected ? "bold" : "normal")};
    font-size: 20px;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
`;

const StyledSlider = styled(Slider)`
    .slick-dots {
        
    }
`;

const SliderContainer = styled.div `
    width: 520px;
    height: 535px;
    margin: auto;
`;

const FriendListSlide = styled.div `
    width: 95% !important;
    display: flex !important;
    height: 110px;
    box-sizing: border-box;
    align-items: center;

    // 아래 요소들은 피그마랑 다름
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    border-left: 10px solid #0579a4;
    margin: 10px 0 10px 15px;

    &:focus {
        outline: none;
}
`;

const FriendImage = styled.div `
    width: 90px;
    height: 90px;
    border-radius: 180px;
    background-color: #e0e0e0;
    margin: 0 30px 0 20px;
`;

const FriendName = styled.span `
    font-size: 24px;
    margin-bottom: 10px;
`;

const FriendId = styled.span `
    font-size: 20px;
    color: #707070;
`;

const ListIconStyle = styled.img `
    height: 24px;
    // display: ${(props) => (props.selected ? "block" : "none")};
    cursor: pointer;
    filter: invert(99%) sepia(0%) saturate(6%) hue-rotate(146deg) brightness(92%) contrast(92%);

    &:hover {
        filter: invert(95%) sepia(7%) saturate(4256%) hue-rotate(297deg) brightness(85%) contrast(132%);
    }
`;

const RequestIconStyle = styled.img `
    height: 16px;
    // display: ${(props) => (props.selected ? "block" : "none")};
    cursor: pointer;
    filter: invert(99%) sepia(0%) saturate(6%) hue-rotate(146deg) brightness(92%) contrast(92%);

    &:hover {
        filter: invert(95%) sepia(7%) saturate(4256%) hue-rotate(297deg) brightness(85%) contrast(132%);
    }
`;

// ---------------친구 목록 Component---------------
function ListAndRequest({ handleChange, onEnterPress, selected, inputValue, sortOption, isSearching, setIsSearching }) {
    const sliderRef = useRef(null);
    const debouncedInputValue = useDebounce(inputValue, 1000); // 1초의 지연 시간 설정
    const [prevSortOption, setPrevSortOption] = useState(sortOption); // 이전 값 상태로 저장

    const [friendList, setFriendList] = useState([]);
    const [friendRequestList, setFriendRequestList] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(true); // 처음 렌더링 & 친구 데이터의 삭제, 수락, 거부 이벤트 발생할 때 true
    const [searchResults, setSearchResults] = useState([]); // 검색 결과를 저장할 상태

    const [modals, setModals] = useState({
        oneBtnModal: false,
        deleteModal: false,
        addModal: false,
    });
    const [thisFriendName, setThisFriendName] = useState('');
    const [thisUserId, setThisUserId] = useState('');
    const [thisFriendId, setThisFriendId] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalChildren, setModalChildren] = useState('');
    // const [modalAction, setModalAction] = useState(''); // 'reject' 또는 'approve'   

    // ----------------------Friend Search Bar 관련 코드----------------------
    const handleEnterDown = (event) => {
        if (event.key === 'Enter') {
            onEnterPress();
        }
    }

    // ----------------------List & Request 관련 코드----------------------
    // '친구 목록 조회' API 연결
    const handleFriendList = async () => {
        try {
            const friendData = await getFriendList(sortOption);
            setFriendList(friendData);
        } catch (error) {
            console.error('Error handle Friend List:', error);
        }
    };

    // '친구 요청 목록 조회' API 연결
    const handleFriendRequest = async () => {
        try {
            const requestData = await getFriendRequest();
            setFriendRequestList(requestData);
        } catch (error) {
            console.error('Error handle Friend Request:', error);
        }
    };

    // 처음 렌더링 또는 친구 삭제, 친구 요청 수락, 거부했을 때 친구 목록과 친구 요청 다시 불러오는 useEffect
    // (현재 두번 불러와지는데 React.StrictMode라 그렇고 배포할 때는 이상 없을 듯)
    useEffect(() => {
        if (isDataFetched) {
            handleFriendList();
            handleFriendRequest();
            setIsDataFetched(false); // 초기 데이터를 불러온 후 true로 설정
        }
    }, [isDataFetched]);

    // sortOption이 바뀔 때마다 친구 목록을 다시 불러오는 useEffect (친구 요청은 불러오지 않음)
    useEffect(() => {
        if (prevSortOption !== sortOption) {
            handleFriendList(); // sortOption이 변경되었을 때만 실행
            setPrevSortOption(sortOption); // 이전 값을 현재 값으로 업데이트
        }
    }, [sortOption]);

    // '친구 검색' API 연결 (검색어 입력하고 1초 지났을 때 실행)
    useEffect(() => {
        if (debouncedInputValue) {
            setIsSearching(true); // 검색 중 상태
            getSearchedFriend(debouncedInputValue) // API 호출
                .then((data) => setSearchResults(data))
                .catch((error) => console.error('Error searching friends:', error));
        } else {
            setIsSearching(false); // 검색이 끝났을 때 다시 전체 목록 보여줌
            setSearchResults([]); // 검색 결과 초기화
        }
    }, [debouncedInputValue]);

    // 검색 중인지 아닌지 판단해서 알맞는 친구 목록 보여줌
    const filteredData = isSearching
    ? searchResults // 검색 중이면 검색 결과를 표시
    : (Number(selected) === 0 ? friendList : friendRequestList); // 검색 중이 아니면 전체 목록을 표시

    // Slider 설정
    const settings = {
        arrows: false,
        dots: true,
        infinite: filteredData.length > 4,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        rows: 4,
        slidesPerRow: 1,
    };

    // 친구 목록과 친구 요청 각각 보여줄 때 slick slider 1페이지로 원위치하는 useEffect
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(0);
        }
    }, [selected, sortOption]);

    useEffect(() => {
        if (debouncedInputValue === '' && sliderRef.current) {
            sliderRef.current.slickGoTo(0);
        }
    }, [debouncedInputValue]);

    // ----------------------Modal 관련 코드----------------------
    // 특정 모달 열기
    const openModal = (modalKey) => {
        setModals((prev) => ({ ...prev, [modalKey]: true }));
    };

    // 특정 모달 닫기
    const closeModal = (modalKey) => {
        setModals((prev) => ({ ...prev, [modalKey]: false }));
    };

    // 친구 삭제 Modal
    const handleDeleteFriend = (friendName, userId, friendId) => {
        setThisFriendName(friendName);
        setThisUserId(userId);
        setThisFriendId(friendId);
        openModal('deleteModal');
        setModalTitle(`'${userId}(${friendName})'님을 친구 목록에서 삭제하시겠습니까?`);
    };

    // 친구 삭제 완료 Modal & '친구 삭제' API 연결
    const completeDeleteFriend = async () => {
        try {
            await deleteFriend(thisFriendId); // API 호출하여 친구 삭제
            console.log(`'${thisUserId}(${thisFriendName})'을 친구 목록에서 삭제 완료`);
            openModal('oneBtnModal'); // 삭제 완료 모달 표시
            setModalTitle('친구를 목록에서 삭제하였습니다.');
            setIsDataFetched(true); // 삭제 후 친구 목록을 다시 불러오기 위해 isDataFetched를 true로 설정
        } catch (error) {
            console.error('Error completing delete friend:', error);
            setModalTitle('친구 삭제에 실패했습니다.');
            openModal('oneBtnModal');
        }
    };

    // 친구 추가 Modal
    const handleAddFriend = (inputValue) => {
        const friendExists = friendList.some(friend => friend.userId === inputValue);
        if (friendExists) {
            openModal('oneBtnModal');
            setModalTitle('이미 친구 목록에 등록된 친구입니다');
        } else {
            openModal('addModal'); // 친구 추가 확인 모달 열기
            setModalTitle('친구 추가 요청을 보내시겠습니까?');
            setModalChildren('한번 보낸 요청은 취소할 수 없습니다.');
        }
    }

    // 친구 추가 완료 Modal & '친구 추가 완료
    const completeAddFriend = async () => {
        try {
            await fetchAddFriend(inputValue); // 친구 추가 API 호출
            openModal('oneBtnModal'); // 성공 메시지 모달 표시
            setModalTitle('친구 요청이 완료되었습니다.');
            setIsDataFetched(true); // 친구 목록을 다시 불러오도록 설정
        } catch (error) {
            setModalTitle(error.message === 'User not found' ? '존재하지 않는 아이디입니다.' : '친구 추가에 실패했습니다.');
            openModal('oneBtnModal'); // 오류 메시지 모달 표시
        }
    }

    // 친구 요청 거절 Modal
    const handleRejectFriend = async (friendName, userId, friendId) => {
        try {
            await fetchFriendRequestReject(friendId); // API 호출하여 친구 요청 거절
            openModal('oneBtnModal'); // 거절 완료 모달 표시
            setModalTitle(`'${userId}(${friendName})'님의 친구 요청을 거절하였습니다.`);
            setIsDataFetched(true); // 친구 목록을 다시 불러오기 위해 isDataFetched를 true로 설정
        } catch (error) {
            console.error('Error rejecting friend request:', error);
            setModalTitle('친구 요청 거절에 실패했습니다.');
            openModal('oneBtnModal');
        }
    }

    // 친구 요청 수락 Modal
    const handleAcceptFriend = async (friendName, userId, friendId) => {
        try {
            await fetchFriendRequestAccept(friendId); // API 호출하여 친구 요청 수락
            openModal('oneBtnModal'); // 수락 완료 모달 표시
            setModalTitle(`'${userId}(${friendName})'님의 친구 요청을 수락하였습니다.`);
            setIsDataFetched(true); // 친구 목록을 다시 불러오기 위해 isDataFetched를 true로 설정
        } catch (error) {
            console.error('Error accepting friend request:', error);
            setModalTitle('친구 요청 수락에 실패했습니다.');
            openModal('oneBtnModal');
        }
    }

    // // 모달 상태 업데이트
    // useEffect(() => {
    //     if (thisFriendName && thisUserId) {
    //         if (modalAction === 'reject') {
    //             openModal('oneBtnModal');
    //             setModalTitle(`'${thisUserId}(${thisFriendName})'님의 친구 요청을 거절하였습니다.`);
    //         } else if (modalAction === 'approve') {
    //             openModal('oneBtnModal');
    //             setModalTitle(`'${thisUserId}(${thisFriendName})'님의 친구 요청을 수락하였습니다.`);
    //         }
    //     }
    // }, [modalAction]); // 상태가 변경될 때마다 모달 상태 업데이트

    return (
        <>
            <SearchBarStyle style={{ visibility: selected === 1 ? 'hidden' : 'visible' }}>
                <LeftContent>
                    <img src={ searchIcon } alt='검색 돋보기 아이콘' />
                </LeftContent>
                <input 
                    type='search' 
                    placeholder='친구 아이디' 
                    value={ inputValue }
                    onChange={ handleChange }
                    onKeyDown={ handleEnterDown }
                />
                {inputValue && (
                    <RightContent>
                        <span>를(을) 친구 추가</span>
                        <img 
                            src={ addIcon } 
                            alt='친구 추가 아이콘' 
                            onClick={ () => handleAddFriend(inputValue) }
                        />
                    </RightContent>
                )}
            </SearchBarStyle>

            <SliderContainer>
                <StyledSlider ref={sliderRef} {...settings} key={filteredData.length}>
                {filteredData.map((friend) => (
                    <FriendListSlide key={friend.friendId}>
                        <FriendImage />
                        <div 
                            style={{ 
                                display: 'flex',
                                flexDirection: 'column'
                        }}>
                            <FriendName>{friend.friendName}</FriendName>
                            <FriendId>{friend.userId}</FriendId>
                        </div>
                        {/* 친구 삭제 아이콘 */}
                        {!selected && (
                            <ListIconStyle 
                                src={deleteIcon} 
                                alt='친구 삭제 아이콘' 
                                style={{ margin: '0 20px 0 auto' }}
                                onClick={() => handleDeleteFriend(friend.friendName, friend.userId, friend.friendId) }
                            />
                        )}
                        {/* 친구 요청 거절 아이콘 */}
                        {selected && (
                            <RequestIconStyle 
                                src={rejectIcon} 
                                alt='친구요청 거절 아이콘' 
                                style={{ marginLeft: 'auto' }}
                                onClick={() => handleRejectFriend(friend.friendName, friend.userId)}
                            />
                        )}
                        {/* 친구 요청 승인 아이콘 */}
                        {selected && (
                            <RequestIconStyle 
                                src={approveIcon} 
                                alt='친구요청 승인 아이콘' 
                                style={{ margin: '0 20px 0 30px' }}
                                onClick={() => handleAcceptFriend(friend.friendName, friend.userId)}
                            />
                        )}
                    </FriendListSlide>
                ))}
                </StyledSlider>
            </SliderContainer>

            {/* Modals */}
            <CommonModal 
                isOpen={modals.oneBtnModal} 
                onRequestClose={ () => closeModal('oneBtnModal') }
                title={modalTitle}
                type={1}
            />
            <CommonModal 
                isOpen={modals.deleteModal} 
                onRequestClose={ () => closeModal('deleteModal') }
                title={modalTitle}
                type={2}
                onConfirm={completeDeleteFriend}
            />
            <CommonModal 
                isOpen={modals.addModal} 
                onRequestClose={ () => closeModal('addModal') }
                title={modalTitle}
                children={modalChildren}
                type={2}
                onConfirm={completeAddFriend}
            />
        </>
    )
}

export default function Friend() {
    const [isMiniMenuClicked, setIsMiniMenuClicked] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [sortOption, setSortOption] = useState(1);
    const [isSearching, setIsSearching] = useState(false); // 검색 상태 추가

    const handleClick = (index) => {
        console.log("Setting selected:", index); // 로그 추가
        setIsMiniMenuClicked(index);
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSortOptionChange = (option) => {
        setSortOption(option);
    };

    // isMiniMenuClicked 변경 시 inputValue 초기화
    useEffect(() => {
        setInputValue('');
    }, [isMiniMenuClicked]);

    return (
        <div>
            <section>
                {/* 헤더 */}
                <header>
                    <HeaderStyle>친구 목록</HeaderStyle>
                </header>

                {/* 친구 목록 / 친구 요청 */}
                <article>
                    <ArticleStyle>
                        {/* 버튼 & 드롭다운 */}
                        <MiniNavStyle>
                            {/* 미니 메뉴 버튼 */}
                            <MiniMenuStyle>
                                <MiniMenuBtn
                                    selected={ isMiniMenuClicked === 0 }
                                    onClick={ () => handleClick(0) }
                                >
                                    친구 목록
                                </MiniMenuBtn>
                                <img src={ slashIcon } alt='슬래시 아이콘' />
                                <MiniMenuBtn
                                    selected={ isMiniMenuClicked === 1 }
                                    onClick={ () => handleClick(1) }
                                >
                                    친구 요청
                                </MiniMenuBtn>
                            </MiniMenuStyle>
                            {/* 드롭다운 - 최신순 // 이름순 */}
                            {!isSearching && isMiniMenuClicked === 0 && (
                                <SortDropdown
                                    firstMenu="최신순"
                                    secondMenu="이름순"
                                    handleMenuClick={handleSortOptionChange}
                                />
                            )}
                        </MiniNavStyle>
                        {/* 목록 + 친구 검색바 */}
                        <ListAndRequest 
                            handleChange={handleChange}
                            selected={ isMiniMenuClicked === 1 }
                            inputValue={inputValue}
                            sortOption={sortOption}
                            isSearching={isSearching}
                            setIsSearching={setIsSearching}
                        />
                    </ArticleStyle>
                </article>
            </section>
        </div>
    )
}