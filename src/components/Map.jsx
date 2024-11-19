import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import useGeolocation from '../assets/hooks/useGeolocation';
import { handleSearch as fetchSearchResults } from '../api/Mytrip/Itineraries'; // handleSearch를 fetchSearchResults로 가져옴

const SearchContainer = styled.div`
  max-width: 950px;
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const SearchInput = styled.input`
  width: 800px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #59ABE6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: NanumGothic;
  font-size: 16px;
`;

const SearchResultsContainer = styled.div`
  max-width: 950px;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  border: 1px solid #ddd;
`;

const SearchResults = styled.ul`
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
`;

const SearchResultItem = styled.li`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  position: relative;

  .text-container {
    display: flex;
    flex-direction: column;
    padding: 5px;
  }

  .title {
    font-family: NanumGothic;
    font-weight: bold;
    font-size: 14px;
    color: #333;
    margin-bottom: 2px;
  }

  .address {
    font-family: NanumGothic;
    font-size: 12px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 150px;
  }

  .add-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    width: 70px;
    background-color: transparent;
    color: #4CAF50;
    font-size: 12px;
    font-weight: bold;
    border: 1px solid #4CAF50;
    border-radius: 4px;
    cursor: pointer;
  }

  &:hover {
    background-color: #f5f5f5;
  }

  &:hover .add-button {
    background-color: #4CAF50;
    color: white;
  }
`;

const NoResultsMessage = styled.div`
  display: flex;
  width: 20%;
  margin-top: 250px;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: NanumGothic;
  font-size: 14px;
  color: #000;
  text-align: center;
`;

const MapWithTabsContainer = styled.div`
  max-width: 950px;
`;

const MapContainer = styled.div`
  width: 80%;
  height: 500px;
  border: 1px solid #ddd;
  box-sizing: border-box;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;  /* 탭과 콘텐츠를 세로로 배치 */
  border: 1px solid #ddd;
  width: 450px;
  margin: 20px auto;
  background-color: #EEF5FF;
`;

const DayTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #E0E0E0;
  width: 450px;
  margin: 10px auto;
  margin-bottom: 20px;
`;

const DayTab = styled.div`
  flex-shrink: 0;  /* 탭이 축소되지 않도록 설정 */
  padding: 10px 20px 20px;
  font-size: 20px;
  font-weight: ${(props) => (props.isSelected ? 'bold' : 'normal')};
  color: ${(props) => (props.isSelected ? '#59ABE6' : '#888')};
  cursor: pointer;
  border-bottom: ${(props) => (props.isSelected ? '3px solid #59ABE6' : '1px solid transparent')};
  white-space: nowrap;
  text-align: center;  /* 텍스트를 중앙 정렬 */
  font-family: NanumGothic;
`;

const Content = styled.div`
  padding: 20px;
  font-family: NanumGothic;
`;

function Map() {
  const mapRef = useRef(null);
  const { naver } = window;
  const { currentMyLocation } = useGeolocation();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (currentMyLocation.lat !== 0 && currentMyLocation.lng !== 0) {
      const mapOptions = {
        center: new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
        logoControl: false,
        mapDataControl: false,
        scaleControl: true,
        tileDuration: 200,
        zoom: 14,
        zoomControl: true,
        zoomControlOptions: { position: 9 },
        baseTileOpacity: 1,
        background: 'white',
        tileSpare: 7,
      };

      mapRef.current = new naver.maps.Map('map', mapOptions);
    }
  }, [currentMyLocation]);

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const results = await fetchSearchResults(searchQuery); // API 함수 호출
      setSearchResults(results); // 검색 결과 상태 업데이트

      // 키워드 기반 장소 이동 처리
      const matchedLocation = Object.keys(locationMapping).find((key) =>
        searchQuery.toLowerCase().includes(key.toLowerCase())
      );

      if (matchedLocation && mapRef.current) {
        const { lat, lng } = locationMapping[matchedLocation];
        const newLatLng = new naver.maps.LatLng(lat, lng);

        mapRef.current.setCenter(newLatLng);
        mapRef.current.setZoom(13); // 적절한 확대 수준
      }
    } catch (error) {
      console.error('검색 중 오류 발생:', error);
    }
  };

  const locations = [
      { name: '부산', lat: 35.1796, lng: 129.0756 },
      { name: '서울', lat: 37.5665, lng: 126.9780 },
      { name: '대구', lat: 35.8722, lng: 128.6025 },
      { name: '제주', lat: 33.4996, lng: 126.5312 },
      { name: '인천', lat: 37.4563, lng: 126.7052 },
      { name: '광주', lat: 35.1595, lng: 126.8526 },
      { name: '대전', lat: 36.3504, lng: 127.3845 },
      { name: '울산', lat: 35.5373, lng: 129.3114 },
      { name: '수원', lat: 37.2636, lng: 127.0286 },
      { name: '창원', lat: 35.2288, lng: 128.6812 },
      { name: '포항', lat: 36.0194, lng: 129.3422 },
      { name: '천안', lat: 36.8210, lng: 127.1448 },
      { name: '김해', lat: 35.2321, lng: 128.8828 },
      { name: '전주', lat: 35.8244, lng: 127.1500 },
      { name: '강릉', lat: 37.7517, lng: 128.8760 },
      { name: '여수', lat: 34.7606, lng: 127.6628 },
      { name: '포천', lat: 37.9000, lng: 127.2000 },
      { name: '안산', lat: 37.3215, lng: 126.8290 },
      { name: '남양주', lat: 37.6354, lng: 127.2115 },
      { name: '경주', lat: 35.8575, lng: 129.2242 },
  ];

  // 필요할 때 동적으로 생성
  const locationMapping = locations.reduce((acc, loc) => {
    acc[loc.name] = { lat: loc.lat, lng: loc.lng };
    return acc;
  }, {});  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddMarker = (result) => {
    const newMarker = {
      ...result,
      index: markers.length + 1,
    };
    setMarkers([...markers, newMarker]);
  };

  useEffect(() => {
    if (mapRef.current) {
      markers.forEach((marker) => {
        const position = new naver.maps.LatLng(marker.lat, marker.lng);
        new naver.maps.Marker({
          position,
          map: mapRef.current,
          icon: {
            content: `
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42" fill="none">
                <path d="M16 40C16 40 31 26.4348 31 16.2609C31 7.83252 24.2843 1 16 1C7.71573 1 1 7.83252 1 16.2609C1 26.4348 16 40 16 40Z" fill="black"/>
                <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" style="fill: #FFF; font-family: NanumGothic; font-size: 20px; font-weight: 600;">${marker.index}</text>
              </svg>
            `,
            size: new naver.maps.Size(32, 42),
            anchor: new naver.maps.Point(16, 42),
          },
        });
      });
    }
  }, [markers]);

  return (
    <>
      <SearchContainer>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="장소 검색"
        />
        <SearchButton onClick={handleSearch}>검 색</SearchButton>
      </SearchContainer>

      <SearchResultsContainer>
        {searchResults.length > 0 ? (
          <SearchResults>
            {searchResults.map((result, index) => (
              <SearchResultItem key={index}>
                <div className="text-container">
                  <span className="title">{result.title}</span>
                  <span className="address">{result.address}</span>
                </div>
                <button className="add-button" onClick={() => handleAddMarker(result)}>
                  + 추가
                </button>
              </SearchResultItem>
            ))}
          </SearchResults>
        ) : (
          <NoResultsMessage>원하는 장소를 검색해보세요.</NoResultsMessage>
        )}
        <MapWithTabsContainer>
          <MapContainer id="map" />
          <TabContainer>
          <DayTabs>
            {/* Swiper 컴포넌트를 사용하여 탭을 스와이프 가능하게 만들기 */}
            <Swiper
              spaceBetween={0} // 슬라이드 간 간격을 0으로 설정하여 탭들이 붙어서 보이게 함
              slidesPerView={3} // 한 화면에 3개의 탭을 보여줌
              onSlideChange={(swiper) => setActiveTab(swiper.realIndex)} // 슬라이드가 변경될 때 activeTab 업데이트
              loop={false} // loop 활성화로 무한 스와이프를 방지
            >
              {days.map((day, index) => (
                <SwiperSlide key={index}>
                  <DayTab
                    isSelected={activeTab === index}
                    onClick={() => handleTabClick(index)}>
                    {day}
                  </DayTab>
                </SwiperSlide>
              ))}
            </Swiper>
          </DayTabs>
          {/* 콘텐츠 부분 */}
          <Content>
            {`DAY ${activeTab + 1} Content`}
          </Content>
        </TabContainer>
        </MapWithTabsContainer>
      </SearchResultsContainer>
    </>
  );
}

export default Map;