import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';
import YesNoModal from '../../components/YesNoModal';
import Map from '../../components/Map'
import { getItineraries, updateItinerary, deleteItinerary, handleSearch } from '../../api/Mytrip/Itineraries';

const ButtonContainer = styled.div`
    display: flex;
    max-width: 1400px;
    justify-content: right;
    flex-shrink: 0;
    margin: 150px auto 0px; /* 좌우 가운데 정렬을 위해 margin을 사용 */
`;

const NavButton = styled.button`
    display: flex;
    width: 80px;
    height: 36px;
    margin: 0 5px 5px 0;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 20px;
    background: #F6F6F6;
    color: #000;
    font-family: NanumGothic;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    border: none;
    &:hover {
        background-color: #000;
        color: #FFF;
    }
`;

// 상단의 썸네일, 제목, 날짜를 포함하는 컨테이너
const HeaderContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1400px;
  height: 400px;
  background-image: ${({ thumbnail }) => `url(${thumbnail})`};
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  margin: 0 auto; /* 좌우 가운데 정렬을 위해 margin을 사용 */

  overflow: hidden; /* 오버레이가 컨테이너를 벗어나지 않도록 */

  /* 오버레이를 추가하여 투명도 조절 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2); /* 원하는 투명도 값으로 설정 */
    z-index: 1; /* 텍스트와 같은 컨텐츠보다 아래에 위치 */
  }

  /* 오버레이 위에 텍스트가 위치하도록 */
  > * {
    position: relative;
    z-index: 2;
  }
`;

const Title = styled.h1`
  font-family: NanumGothic;
  font-size: 60px;
  font-weight: bold;
  color: #fff;
  margin: 80px 0 60px 0;
  text-align: center; /* 텍스트를 가운데 정렬 */
`;

const EditButton = styled.button`
    display: flex;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    height: 35px;
    background-color: transparent;
    border: none;
    justify-content: right;
    align-items: center;
    flex-shrink: 0;
`;

const UserId = styled.h3`
  font-family: NanumGothic;
  font-size: 18px;
  color: #fff;
  text-align: center; /* 텍스트를 가운데 정렬 */
`;

const DateRange = styled.h3`
  font-family: NanumGothic;
  font-size: 20px;
  color: #fff;
  text-align: center; /* 텍스트를 가운데 정렬 */
`;

const MapContainer = styled.div`
  max-width: 950px;
`;

const DayTabs = styled.div`
  display: flex;
  border-bottom: 2px solid #E0E0E0;
  width: 450px;
  height: 60px; 
  margin: 20px auto;
  margin-bottom: 20px;
`;

const DayTab = styled.button`
  padding: 10px 20px;
  background-color: #EEF5FF;
  color: #000;
  border: none;
  cursor: pointer;
  flex-grow: 1;
  color: #000;
  text-align: center;
  font-family: NanumGothic;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
`;

const NavigationButton = styled.button`
  padding: 10px 20px;
  background-color: #EEF5FF;
  border: none;
  cursor: pointer;
`;

// 지도와 탭 들어있는 부분
const EditorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 100px;
  padding: 0 20px;
`;

export default function TripDetailEditorPage({ onChange = () => { } }) {
    const { id } = useParams(); // URL 파라미터에서 ID 가져오기
    const location = useLocation();
    const navigate = useNavigate();

    // 위치 상태에서 게시물 가져오기
    const { posts, editedTrip } = location.state || {};
    const trip = editedTrip || (posts ? posts.find(post => post.id === Number(id)) : null);
    const { 제목: title = '', 기간: dateRange = '', 썸네일: thumbnail = '', value = [], 여행지: destinationArray = [] } = trip || {};

    const [currentDay, setCurrentDay] = useState(1);
    const [days, setDays] = useState([]);
    const [itineraryDetails, setItineraryDetails] = useState({});
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [modalOpen, setModalOpen] = useState(false); // 모달 열림 상태 추가

    useEffect(() => {
      if (dateRange) {
        const [startDate, endDate] = dateRange.split(' ~ ').map(date => new Date(date.replace(/\//g, '-')));
        const dayCount = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
        const dayTabs = Array.from({ length: dayCount }, (_, i) => `DAY ${i + 1}`);
        setDays(dayTabs);
      }
    }, [dateRange]);

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    };

    const modules = {
        toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        [{ 'align': [] }, { 'color': [] }, { 'background': [] }],
        ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'align', 'color', 'background',
    ];

    const handleContentChange = (content, delta, source, editor) => {
        const newContent = [...value];
        newContent[currentDay - 1] = content;
        onChange(newContent);
    };

    const handlePreviousDay = () => {
        setCurrentDay((prev) => (prev > 1 ? prev - 1 : prev));
    };

    const handleNextDay = () => {
        setCurrentDay((prev) => (prev < days.length ? prev + 1 : prev));
    };

    const handleCancelClick = () => {
        setModalOpen(true); // 모달 열기
    };

    const handleSaveClick = async () => {
      try {
          await updateItinerary(id, { value });
          navigate(`/mytrip/${id}`);
      } catch (error) {
          console.error("저장 중 오류 발생:", error.message);
      }
    };

    const handleModalClose = () => {
        setModalOpen(false); // 모달 닫기
    };
   
    // API 호출
    useEffect(() => {
      const fetchDetails = async () => {
          if (id) {
              const details = await getItineraries(id);
              console.log(details);
              setItineraryDetails(details);
              setLoading(false); // 로딩 종료
          }
      };

      fetchDetails();
    }, [id]);

    // 로딩 중일 때 처리
    if (loading) {
      return <div>로딩 중...</div>; // 로딩 중 메시지
    }

  return (
    <div>
      <ButtonContainer>
        <NavButton onClick={handleCancelClick}>취소하기</NavButton>
        <NavButton onClick={handleSaveClick}>저장하기</NavButton>
      </ButtonContainer>

      {/* 취소하기 모달창 */}
      <YesNoModal
        isOpen={modalOpen}
        onRequestClose={handleModalClose}
        title="작성을 취소하시겠습니까?"
        bodyText="작성 중이던 내용이 모두 삭제됩니다."
        navigateTo="/mytrip"
      >
      </YesNoModal>

      {/* 썸네일, 제목, 날짜를 표시하는 상단 영역 */}
      <HeaderContainer thumbnail={itineraryDetails.thumbnail || ''}>
        <EditButton>
          <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
            <path d="M28.2916 10.7046L24.2958 6.70874C23.7743 6.21888 23.0909 5.9378 22.3756 5.91898C21.6604 5.90016 20.9632 6.1449 20.4166 6.60665L7.29161 19.7317C6.82023 20.207 6.52672 20.8301 6.46036 21.4962L5.83328 27.5775C5.81363 27.7911 5.84135 28.0064 5.91445 28.2081C5.98755 28.4097 6.10424 28.5928 6.25619 28.7442C6.39246 28.8793 6.55407 28.9862 6.73175 29.0588C6.90943 29.1314 7.09968 29.1682 7.29161 29.1671H7.42286L13.5041 28.6129C14.1703 28.5465 14.7933 28.253 15.2687 27.7817L28.3937 14.6567C28.9031 14.1185 29.1784 13.4003 29.1593 12.6595C29.1402 11.9187 28.8281 11.2157 28.2916 10.7046V10.7046ZM23.3333 15.5754L19.4249 11.6671L22.2687 8.7504L26.2499 12.7317L23.3333 15.5754Z" fill="white" />
          </svg>
        </EditButton>
        <Title>{itineraryDetails.title}</Title>
        <UserId>{itineraryDetails.user_id}</UserId>
        <DateRange>{formatDate(itineraryDetails.startdate)} ~ {formatDate(itineraryDetails.enddate)}</DateRange>
      </HeaderContainer>

      <EditorContainer>
        <MapContainer>
          <Map />
        </MapContainer>

        {/* Day 탭을 선택할 수 있는 영역 */}
        <DayTabs>
          <NavigationButton onClick={handlePreviousDay}>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
              <path d="M27.8334 35.4161C27.5527 35.415 27.2752 35.3572 27.0175 35.2463C26.7597 35.1353 26.527 34.9734 26.3334 34.7702L18.2917 26.4369C17.91 26.0475 17.6962 25.5239 17.6962 24.9786C17.6962 24.4333 17.91 23.9097 18.2917 23.5202L26.625 15.1869C26.8193 14.9927 27.0499 14.8386 27.3037 14.7335C27.5575 14.6283 27.8295 14.5742 28.1042 14.5742C28.3789 14.5742 28.6509 14.6283 28.9047 14.7335C29.1585 14.8386 29.3891 14.9927 29.5834 15.1869C29.7776 15.3812 29.9317 15.6118 30.0368 15.8656C30.142 16.1194 30.1961 16.3914 30.1961 16.6661C30.1961 16.9408 30.142 17.2128 30.0368 17.4666C29.9317 17.7204 29.7776 17.951 29.5834 18.1452L22.7084 24.9994L29.3334 31.8744C29.7214 32.2647 29.9392 32.7928 29.9392 33.3432C29.9392 33.8935 29.7214 34.4216 29.3334 34.8119C29.1362 35.0075 28.902 35.1617 28.6444 35.2655C28.3868 35.3692 28.111 35.4204 27.8334 35.4161Z" fill="black"/>
            </svg>
          </NavigationButton>
          <DayTab isSelected>{`DAY ${currentDay}`}</DayTab>
          <NavigationButton onClick={handleNextDay}>
            <svg xmlns="http://www.w3.org/2000/svg" width="49" height="49" viewBox="0 0 49 49" fill="none">
              <path d="M21.4375 34.7067C21.1688 34.7083 20.9025 34.6568 20.6537 34.5552C20.405 34.4536 20.1787 34.3039 19.988 34.1147C19.7966 33.9249 19.6447 33.699 19.5411 33.4502C19.4374 33.2015 19.384 32.9346 19.384 32.6651C19.384 32.3955 19.4374 32.1287 19.5411 31.8799C19.6447 31.6311 19.7966 31.4053 19.988 31.2155L26.7459 24.4984L20.2534 17.7405C19.8731 17.358 19.6597 16.8405 19.6597 16.3011C19.6597 15.7617 19.8731 15.2443 20.2534 14.8617C20.4432 14.6704 20.669 14.5185 20.9178 14.4148C21.1666 14.3112 21.4334 14.2578 21.703 14.2578C21.9725 14.2578 22.2393 14.3112 22.4881 14.4148C22.7369 14.5185 22.9627 14.6704 23.1525 14.8617L31.0334 23.0284C31.4075 23.41 31.617 23.9232 31.617 24.4576C31.617 24.992 31.4075 25.5051 31.0334 25.8867L22.8667 34.0534C22.6834 34.2513 22.4628 34.4109 22.2175 34.5231C21.9722 34.6352 21.7071 34.6976 21.4375 34.7067V34.7067Z" fill="black"/>
            </svg>
          </NavigationButton>
        </DayTabs>
      </EditorContainer>

      {/* Quill 에디터 */}
      <ReactQuill
          style={{ width: "1400px", height: "600px", margin: "20px auto"}}
          theme="snow"
          modules={modules}
          formats={formats}
          value={value[currentDay - 1] || ''}
          onChange={handleContentChange}
        />
    </div>
  );
}