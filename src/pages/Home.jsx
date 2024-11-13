import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import styled from 'styled-components';
import Slide1 from '../components/BannerSlide1';
import Slide2 from '../components/BannerSlide2';
import Btn from '../components/Btn';
import Card from '../components/Card';
import ImgBusan from './img/home_busan.png';
import ImgSeoul from './img/home_seoul.png';
import ImgJeju from './img/home_jeju.png';
import ImgGyeongju from './img/home_gyeongju.png';
import ImgGangneung from './img/home_gangneung.png';

const HomeContainer = styled.div`
    width: 100%;
    margin: 95px 0 0 0;
`;

const Slide = styled.div`
    background-color: #eee;
    height: 520px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #333;
    margin: 0;
    background: linear-gradient(
        180deg,
        rgba(238, 245, 255, 0.3) 0%,
        rgba(238, 245, 255, 0.7) 48%,
        #e9f2ff 100%
    );
`;
const CustomSwiper = styled(Swiper)`
    .swiper-container,
    .swiper-button-next,
    .swiper-container,
    .swiper-button-prev {
        display: none !important; /* 내비게이션 버튼 숨기기 */
    }

    .swiper-pagination {
        position: absolute; /* Allow the pagination to be positioned inside the Swiper */
        bottom: 20px; /* Place it at the bottom */
        left: 0;
        right: 0;
        display: flex;
        justify-content: center; /* Center the pagination bullets horizontally */
    }

    .swiper-pagination-bullet {
        background-color: #fff; /* Default bullet color */
        width: 13px;
        height: 13px;
        margin: 0 11px !important;
        opacity: 0.7;
        transition: all 0.2s ease;
    }

    .swiper-pagination-bullet-active {
        background-color: #fff; /* Active bullet color */
        width: 80px;
        border-radius: 15px;
        transition: all 0.2s ease;
    }
`;

// 금주의 게시물

const CategoryTitle = styled.div`
    font-weight: bold;
    font-size: 36px;
    text-align: center;
`;

const SubTitle = styled.div`
    font-size: 24px;
    margin-top: 6px;
    text-align: center;
    color: #707070;
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
    margin: 20px 0 55px 0;
`;

const NavButton = styled.button`
    display: inline-flex;
    margin: 10px;
    padding: 8px 32px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 20px;
    background: #f6f6f6;
    color: #59abe6;
    font-family: NanumGothic;
    font-size: 16px;
    font-weight: 600;
    line-height: 140%;
    border: none;
    &:hover {
        background-color: #59abe6;
        color: #fff;
        transition: all 0.2s ease;

`;

const SharetripContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 180px 0;
`;

// 추천 여행지
const Top5Container = styled.div`
    padding: 180px 0;
    width: 100%;
    background: #f6f9fd;
`;

// 스타일 추가
const RecommendedContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50px 0;
`;

const ImageWrapper = styled.div`
    margin: 0 17px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
`;

const CircularImage = styled.img`
    width: 220px;
    height: 220px;
    margin: 15px 0;
    border-radius: 50%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: scale(1.2);
        box-shadow: 0px 4px 18px rgba(0, 0, 0, 0.4);
    }

    /* 클릭된 이미지에 그림자 효과 추가 */
    ${({ isActive }) =>
        isActive &&
        `
        transform: scale(1.2); /* 클릭 시에도 크기 증가 */
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3); /* 클릭된 이미지에 추가적인 그림자 */
    `}
`;

const DestinationName = styled.div`
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    text-align: center;
`;

export default function Home() {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(2);
    const imageRefs = useRef([]);

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 3번째 이미지로 스크롤
        if (imageRefs.current[2]) {
            imageRefs.current[2].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, []);

    const destinations = [
        { id: 1, name: '부산', image: ImgBusan },
        { id: 2, name: '서울', image: ImgSeoul },
        { id: 3, name: '제주', image: ImgJeju },
        { id: 4, name: '경주', image: ImgGyeongju },
        { id: 5, name: '강릉', image: ImgGangneung },
    ];

    const handleImageClick = (index) => {
        setActiveIndex(index);
        // 클릭된 이미지가 3번째 이미지 위치로 스크롤
        if (imageRefs.current[index]) {
            imageRefs.current[2]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    };

    const handleCardClick = (id) => {
        navigate(`/details/${id}`);
    };

    const [tags, setTags] = useState([]); // 빈 배열로 초기화
    const cardData = [
        {
            id: 1,
            no: 1,
            제목: '부산 3박 4일',
            여행지: ['부산'],
            소유자: 'seorin',
            이미지: ImgBusan,
            날짜: '2024-09-13',
            썸네일: 'https://via.placeholder.com/300',
            댓글: '0',
            좋아요: '0',
        },
        {
            id: 2,
            no: 2,
            제목: '제주 3박 4일',
            여행지: ['제주'],
            이미지: ImgJeju,
            소유자: 'sieun',
            날짜: '2024-11-14',
            썸네일: 'https://via.placeholder.com/300',
            댓글: '0',
            좋아요: '0',
        },
        {
            id: 3,
            no: 3,
            제목: '강릉 2박 3일',
            여행지: ['강릉'],
            이미지: ImgGangneung,
            소유자: 'mijin',
            날짜: '2024-09-15',
            썸네일: 'https://via.placeholder.com/300',
            댓글: '0',
            좋아요: '0',
        },
    ];

    // 컴포넌트가 처음 렌더링될 때 상단으로 스크롤
    useEffect(() => {
        window.scrollTo(0, 0); // 상단으로 스크롤
    }, []);

    return (
        <HomeContainer>
            <CustomSwiper
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                modules={[Pagination, Autoplay]}
            >
                <SwiperSlide>
                    <Slide1 />
                </SwiperSlide>
                <SwiperSlide>
                    <Slide2 />
                </SwiperSlide>
                <SwiperSlide>
                    <Slide>Slide 3</Slide>
                </SwiperSlide>
                <SwiperSlide>
                    <Slide>Slide 4</Slide>
                </SwiperSlide>
            </CustomSwiper>

            {/* {금주의 게시물} */}
            <SharetripContainer>
                <CategoryTitle>금주의 게시물</CategoryTitle>
                <SubTitle>
                    유저들의 다양한 여행 스토리를 확인해보세요.{' '}
                </SubTitle>
                <NavBtnContainer>
                    <NavButton>최신</NavButton>
                    <NavButton>인기</NavButton>
                </NavBtnContainer>
                <CardsContainer>
                    {/* 카드 형식 콘텐츠 */}
                    {cardData.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                        >
                            <Card
                                width="380px"
                                height="380px"
                                key={card.id}
                                heightImg="250px"
                                thumbnail={card.이미지}
                                img={card.썸네일}
                                heightBody="60px"
                                title={card.제목}
                                date={card.날짜}
                                user_id={card.소유자}
                                comment={card.댓글}
                                likes={card.좋아요}
                                isHomePage={false} // 간단한 정보만 표시
                            />
                        </div>
                    ))}
                </CardsContainer>
            </SharetripContainer>

            {/* Top 5 추천 여행지 */}
            <Top5Container>
                <CategoryTitle>추천 여행지 Top 5</CategoryTitle>
                <SubTitle>
                    여기다에서 가장 많은 일정이 만들어진 여행지 Top 5{' '}
                </SubTitle>
                <RecommendedContainer>
                    {destinations.map((destination, index) => (
                        <ImageWrapper
                            key={destination.id}
                            ref={(el) => (imageRefs.current[index] = el)}
                            onClick={() => handleImageClick(index)}
                        >
                            <CircularImage
                                src={destination.image}
                                alt={destination.name}
                                isActive={activeIndex === index} // 클릭된 이미지 여부 전달
                                style={{
                                    transform:
                                        activeIndex === index
                                            ? 'scale(1.2)'
                                            : 'scale(1)',
                                }}
                            />
                            <DestinationName
                                style={{
                                    fontSize:
                                        activeIndex === index ? '22px' : '18px',
                                }}
                            >
                                {' '}
                                {destination.name}
                            </DestinationName>
                        </ImageWrapper>
                    ))}
                </RecommendedContainer>
            </Top5Container>
        </HomeContainer>
    );
}
