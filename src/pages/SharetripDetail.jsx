import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import CommentList from '../components/CommentList';
import Editor from './Mytrip/Editor';

// 썸네일과 관련된 스타일 정의
const ThumbnailContainer = styled.div`
  width: 1276px;
  height: 427px;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  color: #fff;
  font-family: NanumGothic;
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

// Quill 에디터를 포함하는 컨테이너
const EditorContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 100px;
  padding: 0 20px;
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

const DayTabs = styled.div`
  display: flex;
  border-bottom: 2px solid #E0E0E0;
  width: 1400px;
  height: 60px; 
  margin: 0 auto;
  margin-bottom: 20px;
`;

const DayTab = styled.button`
  padding: 10px 20px;
  background-color: ${({ isSelected }) => (isSelected ? '#E0E0E0' : '#FFF')};
  color: ${({ isSelected }) => (isSelected ? '#000' : '#707070')};
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



const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-family: NanumGothic;
  font-size: 40px;
  color: #333;
`;

const Author = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Date = styled.div`
  font-size: 16px;
  opacity: 0.8;
`;

const ContentContainer = styled.div`
  padding: 20px;
`;

const SearchContainer = styled.div`
  max-width: 1400px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const SearchInput = styled.input`
  width: 1400px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #F4A192;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`;

// 지도 컨테이너
const MapContainer = styled.div`
  position: relative;
  width: 1400px;
  height: 500px;
  margin: 20px auto;
`;

// 지도 마커 스타일
const markerContent = styled.div`
  width: 32px;
  height: 40px;
  flex-shrink: 0;
  fill: #000;

  .text{
    display: flex;
    width: 19px;
    height: 18px;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    color: #FFF;
    text-align: center;
    font-family: Inter;
    font-size: 22px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 33px */
    letter-spacing: -0.44px;
  }
`;

// 검색 결과 리스트를 위한 스타일
const SearchResultsContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 300px;
  max-height: 400px;
  background-color: white;
  border-radius: 8px;
  padding: 10px;
  overflow-y: auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* 지도 위에 오도록 높은 z-index 설정 */
`;

const SearchResultItem = styled.li`
  list-style: none;
  margin-bottom: 10px;
  padding: 5px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ButtonContainer = styled.div`
    display: flex;
    max-width: 1400px;
    justify-content: right;
    flex-shrink: 0;
    margin: 150px auto 0px;
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

const Content = styled.div`
  font-size: 16px;
  line-height: 1.5;
  margin-top: 20px;
`;

export default function SharetripDetail() {
  const [modalIsOpen, setModalIsOpen] = useState(false); 
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const { id } = useParams(); 
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const { posts, editedTrip } = location.state || {};
  const trip = editedTrip || (posts ? posts.find(post => post.id === Number(id)) : null);
  const { 제목: title = '', 날짜: dateRange = '', 썸네일: thumbnail = '', 소유자: owner = 'Unknown', 내용: content = '' } = trip || {};

  const [currentDay, setCurrentDay] = useState(1);
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (dateRange) {
      const [startDateStr, endDateStr] = dateRange.split(' ~ ');
      if (!startDateStr || !endDateStr) {
        console.error('Date range is not defined');
        return; 
      }

      const startDate = new window.Date(startDateStr.replace(/\//g, '-'));
      const endDate = new window.Date(endDateStr.replace(/\//g, '-'));
      if (isNaN(startDate) || isNaN(endDate)) {
        console.error('Invalid date format');
        return; // 유효하지 않은 경우 return
      }

      const dayCount = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
      const dayTabs = Array.from({ length: dayCount }, (_, i) => `DAY ${i + 1}`);
      setDays(dayTabs);
    }
  }, [dateRange]);

  const [map, setMap] = useState(null);

  useEffect(() => {
    if (window.naver && !map) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const mapOptions = {
          center: new window.naver.maps.LatLng(latitude, longitude),
          zoom: 14,
        };

        const mapInstance = new window.naver.maps.Map('map', mapOptions);
        setMap(mapInstance);
      }, (error) => {
        console.error('Error fetching location', error);
      });
    }
  }, [map]);

  const handleSearch = () => {
    if (searchKeyword.trim() && map && window.naver && window.naver.maps && window.naver.maps.Service) {
      window.naver.maps.Service.geocode({ query: searchKeyword }, (status, response) => {
        if (status === window.naver.maps.Service.Status.ERROR) {
          alert('검색결과가 없습니다. 다른 주소를 시도해 보세요.');
        } else if (status === window.naver.maps.Service.Status.OK) {
          const results = response.v2.addresses;
          setSearchResults(results);

          if (results.length > 0) {
            const firstResult = results[0];
            const x = parseFloat(firstResult.x);
            const y = parseFloat(firstResult.y);
            const newLocation = new window.naver.maps.LatLng(y, x);

            map.setCenter(newLocation);
            new window.naver.maps.Marker({ position: newLocation, map });
          } else {
            alert('검색결과가 없습니다. 다른 주소를 시도해 보세요.');
          }
        }
      });
    }
  };

  const handleSearchItemClick = (x, y) => {
    const newLocation = new window.naver.maps.LatLng(parseFloat(y), parseFloat(x));
    map.setCenter(newLocation);
    new window.naver.maps.Marker({ position: newLocation, map });
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

  return (
    <div>
      <HeaderContainer thumbnail={thumbnail}>
        <Title>{title}</Title>
        <UserId>{owner}</UserId>
        <DateRange>{dateRange}</DateRange>
      </HeaderContainer>

      <ContentContainer>
        <DayTabs>
          {days.map((day, index) => (
            <DayTab
              key={index}
              isSelected={currentDay === index + 1}
              onClick={() => setCurrentDay(index + 1)}
            >
              {day}
            </DayTab>
          ))}
        </DayTabs>

        {/* Search*/}
        <SearchContainer>
          <SearchInput 
            type="text" 
            placeholder="장소, 주소 검색" 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)} 
          />
          <SearchButton onClick={handleSearch}>Search</SearchButton>
        </SearchContainer>

        {/* 네이버 지도 삽입 */}
        <MapContainer id="map">
          <SearchResultsContainer>
            {searchResults.map((result, index) => (
              <SearchResultItem
                key={index}
                onClick={() => handleSearchItemClick(result.x, result.y)}
              >
                {result.roadAddress || result.jibunAddress}
              </SearchResultItem>
            ))}
          </SearchResultsContainer>
        </MapContainer>

        <h2>상세 내용</h2>
        
        <h2>댓글</h2>
        <CommentList /> 
      </ContentContainer>
    </div>
  );
}
