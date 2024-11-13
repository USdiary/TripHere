import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Newtrip from './Newtrip';
import Tags from '../components/Tags';
import { getPosts } from '../mockdata/mytripMockData';
// Styled Components 정의
const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-family: NanumGothic;
  font-size: 40px;
  color: #333;
`;

const CardsContainer = styled.div`
  width: 1300px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const NavBtnContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 440px;
    height: 34px;
    flex-shrink: 0;
`;

const NavButton = styled.button`
    display: inline-flex;
    margin: 10px;
    padding: 6px 16px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 20px;
    background: ${(props) => (props.selected ? '#59ABE6' : '#F6F6F6')};
    color: ${(props) => (props.selected ? '#FFF' : '#000')};
    font-family: NanumGothic;
    font-size: 16px;
    font-weight: 600;
    line-height: 140%;
    border: none;
    &:hover {
        background-color: ${(props) => (props.selected ? '#0D90EE' : '#0D90EE')};
        color: #FFF;
    }
`;

const SharetripContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 150px;
    margin-bottom: 100px;
`;

const Index = styled.div`
    width: 1280px;
    display: flex; /* Flexbox를 사용하여 자식 요소들을 가로로 나열 */
    justify-content: space-between; /* 요소들 사이의 공간을 자동으로 분배 */
    margin-top: 10px; /* 상단 마진 */
    border-top: 1px solid #424242; /* 상단 테두리 */
    border-bottom: 1px solid #424242; /* 하단 테두리 */

    .title {
        text-align: center; /* 텍스트 중앙 정렬 */
        font-family: NanumGothic;
        font-size: 16px;
        font-weight: 600;
        line-height: 54px; /* 높이와 같은 line-height 설정 */
    }

    .no {
        width: 84px;    /* 너비 설정 */
    }

    .min{
        width: 220px; /* 너비 설정 */
    }

    .max {
        width: 360px; /* 너비 설정 */
    }
`;

const Line = styled.div`
    width: 1280px;
    display: flex; /* Flexbox를 사용하여 자식 요소들을 가로로 나열 */
    justify-content: space-between; /* 요소들 사이의 공간을 자동으로 분배 */
    border-bottom: 1px solid #E0E0E0; /* 하단 테두리 */

    .list {
        text-align: center; /* 텍스트 중앙 정렬 */
        font-family: NanumGothic;
        font-size: 16px;
        font-weight: 600;
        line-height: 54px; /* 높이와 같은 line-height 설정 */
    }

    .no {
        width: 84px;    /* 너비 설정 */
    }

    .min{
        width: 220px; /* 너비 설정 */
    }

    .max {
        width: 360px; /* 너비 설정 */
    }

    &:hover {
        background-color: #F4BFB4;
        color: #FFF;
    }
`;

const EmptyList = styled.div`
    width: 1280px;
    height: 200px;
    justify-content: center;
    align-items: center;
    display: flex;
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
    color: #000;
    text-align: center;
    font-family: NanumGothic;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px; /* 166.667% */
`;

const EmptyCard = styled.div`
    width: 1280px;
    height: 200px;
    justify-content: center;
    align-items: center;
    display: flex;
    margin-top: 67px;
    color: #000;
    text-align: center;
    font-family: NanumGothic;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px; /* 166.667% */
`;



export default function Sharetrip() {
    const [posts, setPosts] = useState(getPosts()); // Fetch initial posts
    const [activeButton, setActiveButton] = useState('popular');
    const [page, setPage] = useState(1); // Page state for pagination
    const limit = 5;
    const offset = (page - 1) * limit; // Pagination offset
    const navigate = useNavigate();
    const [isListView, setIsListView] = useState(false);
    const userName = 10; // Hardcoded user name for now
    const [selectedButton, setSelectedButton] = useState('인기');

    const handleTripClick = (id) => {
        const tripData = posts.find(post => post.id === id);
        if (tripData) {
            navigate(`/details/${id}`, { state: { posts } });
        }
    };

    const [tags, setTags] = useState([]); // Initialize empty tags array
    const filteredPosts = selectedButton === '최신'
        ? posts.filter(post => post.소유자 === userName)
        : selectedButton === '인기'
            ? posts.filter(post => post.소유자 === userName)
            : posts;

    useEffect(() => {
        setPosts(getPosts());
    }, []);

    return (
        <SharetripContainer>
            <NavBtnContainer>
                <NavButton
                    selected={selectedButton === '인기'}
                    onClick={() => setSelectedButton('인기')}
                >
                    인기
                </NavButton>
                <NavButton
                    selected={selectedButton === '최신'}
                    onClick={() => setSelectedButton('최신')}
                >
                    최신
                </NavButton>
            </NavBtnContainer>
            <Title>여행 공유</Title>
            {/* List or Card format rendering */}
            {isListView ? (
                <div>
                    <Index>
                        <div className="title no">No</div>
                        <div className="title max">제목</div>
                        <div className="title min">여행지</div>
                        <div className="title min">소유자</div>
                        <div className="title min">날짜</div>
                    </Index>
                    {filteredPosts.length === 0 ? (
                        <EmptyList>
                            여행 일정이 없습니다.
                        </EmptyList>
                    ) : (
                        filteredPosts.slice(offset, offset + limit).map(({ id, no, 제목, 여행지, 소유자, 날짜, 아이콘 }) => (
                            <Line key={id} onClick={() => handleTripClick(id)}>
                                <div className="list no">{no}</div>
                                <div className="list max">{제목}</div>
                                <div className="list min">
                                    <Tags tags={Array.isArray(여행지) ? 여행지 : [여행지]} />
                                </div>
                                <div className="list min">{소유자}</div>
                                <div className="list min">{날짜}</div>
                            </Line>
                        ))
                    )}
                </div>
            ) : (
                <CardsContainer>
                    {filteredPosts.length === 0 ? (
                        <EmptyCard>
                            여행 일정이 없습니다.
                        </EmptyCard>
                    ) : (
                        filteredPosts.map((post) => (
                            <Card
                                key={post.itinerary_id}
                                thumbnail={post.thumbnail}
                                title={post.title}
                                startdate={formatDate(post.startdate)}
                                enddate={formatDate(post.enddate)}
                                user_id={post.user_id}
                                comment={post.commentnumber}
                                likes={post.likenumber}
                                onClick={() => handleTripClick(post.itinerary_id)}
                            />
                        ))
                    )}
                </CardsContainer>
            )}
        </SharetripContainer>
    );
}

