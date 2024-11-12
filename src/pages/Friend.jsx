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
    cursor: pointer;
    filter: invert(99%) sepia(0%) saturate(6%) hue-rotate(146deg) brightness(92%) contrast(92%);

    &:hover {
        filter: invert(62%) sepia(76%) saturate(554%) hue-rotate(177deg) brightness(93%) contrast(94%);
    }
`;

const RequestIconStyle = styled.img `
    height: 16px;
    cursor: pointer;
    filter: invert(99%) sepia(0%) saturate(6%) hue-rotate(146deg) brightness(92%) contrast(92%);

    &:hover {
        filter: invert(62%) sepia(76%) saturate(554%) hue-rotate(177deg) brightness(93%) contrast(94%);
    }
`;

const AddIconStyle = styled.img `
    height: 24px;
    cursor: pointer;
    filter: invert(51%) sepia(0%) saturate(43%) hue-rotate(186deg) brightness(84%) contrast(89%);

    &:hover {
        filter: invert(62%) sepia(76%) saturate(554%) hue-rotate(177deg) brightness(93%) contrast(94%);
    }
`;

function ListAndRequest({ handleChange, onEnterPress, selected, inputValue, sortOption, isSearching, setIsSearching }) {
    const sliderRef = useRef(null);
    const debouncedInputValue = useDebounce(inputValue, 1000); // 1초의 지연 시간 설정
    const [prevSortOption, setPrevSortOption] = useState(sortOption); // 이전 값 상태로 저장

    // 친구 목록 및 친구 요청 mockdata
    const [friendListData, setFriendListData] = useState([
        { id: 1, friendId: 1, friendName: "mijin", userId: "kimmj5678", addDate: "2024-01-15" },
        { id: 2, friendId: 2, friendName: "sieun", userId: "kose0987", addDate: "2024-01-20" },
        { id: 3, friendId: 3, friendName: "seorin", userId: "chaesr6543", addDate: "2024-01-25" },
        { id: 4, friendId: 4, friendName: "seyeon", userId: "imsy2109", addDate: "2024-02-01" },
        { id: 5, friendId: 5, friendName: "hyeri", userId: "janghr8765", addDate: "2024-02-05" }
    ]);
    const [friendRequestData, setFriendRequestData] = useState([
        { friendId: 1, friendName: "eunsu", userId: "koes2341", addDate: "2024-03-05" }
    ]);
    const [notFriendData, setNotFriendData] = useState([
        { friendName: "donghyeon", userId: "shindh6782", addDate: "2024-03-10" }
    ]);

    const [friendList, setFriendList] = useState(friendListData);
    const [friendRequestList, setFriendRequestList] = useState(friendRequestData);
    // const [isDataFetched, setIsDataFetched] = useState(true); // 데이터를 처음 불러올 때 사용
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


    // 검색 처리
    useEffect(() => {
        if (debouncedInputValue) {
            setIsSearching(true); // 검색 중 상태
            const results = friendListData.filter(friend =>
                friend.userId.toLowerCase().includes(debouncedInputValue.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setIsSearching(false); // 검색이 끝났을 때 다시 전체 목록 보여줌
            setSearchResults([]); // 검색 결과 초기화
        }
    }, [debouncedInputValue]);

    // 검색 중인지 아닌지에 따라 보여줄 목록 결정
    const filteredData = isSearching
        ? searchResults
        : (Number(selected) === 0 ? friendList : friendRequestList);

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

    // 친구 추가 기능
    const handleAddFriend = (inputValue) => {
        const nonFriend = notFriendData.find(user => user.userId === inputValue);

        if (nonFriend) {
            openModal('addModal'); // 친구 추가 확인 모달 열기
            setModalTitle(`'${inputValue}(${nonFriend.friendName})'님에게 친구 추가 요청을 보내시겠습니까?`);
        } else {
            openModal('oneBtnModal'); // 존재하지 않는 아이디 모달 열기
            setModalTitle('존재하지 않는 아이디입니다.');
        }
    };

    // 친구 추가 완료
    const completeAddFriend = () => {
        const newFriendRequest = {
            friendId: friendRequestData.length + 1,
            friendName: thisFriendName,
            userId: thisUserId,
            addDate: new Date().toISOString().split('T')[0]
        };
        setFriendRequestData([...friendRequestData, newFriendRequest]);
        openModal('oneBtnModal');
        setModalTitle('친구 요청이 완료되었습니다.');
    };

    // 친구 삭제 기능
    const handleDeleteFriend = (friendName, userId, friendId) => {
        setThisFriendName(friendName);
        setThisUserId(userId);
        setThisFriendId(friendId);
        openModal('deleteModal');
        setModalTitle(`'${userId}(${friendName})'님을 친구 목록에서 삭제하시겠습니까?`);
    };

    // 친구 삭제 완료
    const completeDeleteFriend = () => {
        setFriendList(friendList.filter(friend => friend.friendId !== thisFriendId));
        openModal('oneBtnModal');
        setModalTitle('친구를 목록에서 삭제하였습니다.');
    };

    // 친구 요청 거절
    const handleRejectFriend = (friendName, userId, friendId) => {
        setFriendRequestList(friendRequestList.filter(request => request.friendId !== friendId));
        openModal('oneBtnModal');
        setModalTitle(`'${userId}(${friendName})'님의 친구 요청을 거절하였습니다.`);
    };

    // 친구 요청 수락
    const handleAcceptFriend = (friendName, userId, friendId) => {
        const acceptedFriend = friendRequestList.find(request => request.friendId === friendId);
        setFriendList([...friendList, acceptedFriend]);
        setFriendRequestList(friendRequestList.filter(request => request.friendId !== friendId));
        openModal('oneBtnModal');
        setModalTitle(`'${userId}(${friendName})'님의 친구 요청을 수락하였습니다.`);
    };

    // 모달 열기/닫기
    const openModal = (modalKey) => setModals((prev) => ({ ...prev, [modalKey]: true }));
    const closeModal = (modalKey) => setModals((prev) => ({ ...prev, [modalKey]: false }));

    return (
        <>
            <SearchBarStyle style={{ visibility: selected === 1 ? 'hidden' : 'visible' }}>
                <LeftContent>
                    <img src={searchIcon} alt='검색 돋보기 아이콘' />
                </LeftContent>
                <input 
                    type='search' 
                    placeholder='친구 아이디' 
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddFriend(inputValue)}
                />
                {inputValue && (
                    <RightContent>
                        <span>를(을) 친구 추가</span>
                        <AddIconStyle 
                            src={addIcon} 
                            alt='친구 추가 아이콘' 
                            onClick={() => handleAddFriend(inputValue)}
                        />
                    </RightContent>
                )}
            </SearchBarStyle>

            <SliderContainer>
                <StyledSlider ref={sliderRef} {...settings} key={filteredData.length}>
                {filteredData.map((friend) => (
                    <FriendListSlide key={friend.friendId}>
                        <FriendImage />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <FriendName>{friend.friendName}</FriendName>
                            <FriendId>{friend.userId}</FriendId>
                        </div>
                        {/* 친구 삭제 아이콘 */}
                        {Number(selected) === 0 && (
                            <ListIconStyle 
                                src={deleteIcon} 
                                alt='친구 삭제 아이콘' 
                                style={{ margin: '0 20px 0 auto' }}
                                onClick={() => handleDeleteFriend(friend.friendName, friend.userId, friend.friendId)}
                            />
                        )}
                        {/* 친구 요청 승인/거절 아이콘 */}
                        {Number(selected) === 1 && (
                            <>
                                <RequestIconStyle 
                                    src={rejectIcon} 
                                    alt='친구 요청 거절 아이콘' 
                                    style={{ marginLeft: 'auto' }}
                                    onClick={() => handleRejectFriend(friend.friendName, friend.userId, friend.friendId)}
                                />
                                <RequestIconStyle 
                                    src={approveIcon} 
                                    alt='친구 요청 승인 아이콘' 
                                    style={{ margin: '0 20px 0 30px' }}
                                    onClick={() => handleAcceptFriend(friend.friendName, friend.userId, friend.friendId)}
                                />
                            </>
                        )}
                    </FriendListSlide>
                ))}
                </StyledSlider>
            </SliderContainer>

            {/* Modals */}
            <CommonModal 
                isOpen={modals.oneBtnModal} 
                onRequestClose={() => closeModal('oneBtnModal')}
                title={modalTitle}
                type={1}
            />
            <CommonModal 
                isOpen={modals.addModal} 
                onRequestClose={() => closeModal('addModal')}
                title={modalTitle}
                type={2}
                onConfirm={completeAddFriend}
            />
            <CommonModal 
                isOpen={modals.deleteModal} 
                onRequestClose={() => closeModal('deleteModal')}
                title={modalTitle}
                type={2}
                onConfirm={completeDeleteFriend}
            />
        </>
    );
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
                            {/* 드롭다운 - 최신순 / 이름순 */}
                            {isMiniMenuClicked === 0 && (
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