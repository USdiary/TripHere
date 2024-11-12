import React, { useState } from 'react';
import styled from 'styled-components';
import menuIcon from '../assets/icons/dot_menu_icon.png';
import trashIcon from '../assets/icons/trash_outline_icon.png';

const StyledCard = styled.div`
    width: 621px;
    height: 435px;
    border-radius: 10px;
    border: 2px solid #e0e0e0;
    display: flex;
    flex-direction: column;
`;

const CardImage = styled.img`
    width: 621px;
    height: 341px;
    object-fit: cover;
`;

const CardInfoAndIcon = styled.div`
    height: 100%;
    margin: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
`;

const CardInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const CardTitle = styled.span`
    font-weight: bold;
    font-size: 24px;
`;

const CardDate = styled.span`
    font-weight: bold;
    font-size: 20px;
    color: #707070;
`;

const MenuIcon = styled.img`
    width: 30px;
    height: 30px;
    cursor: pointer;
`;

const DeleteIcon = styled.img`
    width: 30px;
    height: 30px; 
    cursor: pointer;
    filter: invert(100%) sepia(0%) saturate(2166%) hue-rotate(114deg) brightness(120%) contrast(76%);

    &:hover {
        filter: invert(62%) sepia(76%) saturate(554%) hue-rotate(177deg) brightness(93%) contrast(94%);
`;

const StyledDropdown = styled.div `
    width: 98px;
    height: 74px;
    position: absolute;
    bottom: 25%;
    right: 8%;
    border-radius: 8px;
    border: 1px solid #707070;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    background-color: #fff;
    padding: 10px 0;
    gap: 4px;
`;

const DropdownMenu = styled.div `
    width: 100%;
    font-size: 16px;
    padding: 8px 0 8px 16px;
    box-sizing: border-box;
    color: black;
    cursor: pointer;

    &:hover {
        background-color: #f6f6f6;
        font-weight: bold;
    }
`;

export default function Card({ type, img, title, date, onCardClick, onDeleteScrap, onDeleteFolder, onRenameFolder }) {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    
    const onToggleDropdown = (e) => {
        e.stopPropagation();
        setIsDropdownVisible(prev => !prev); // 드롭다운 가시성 토글
    };

    const handleDeleteFolder = (e) => {
        e.stopPropagation();
        setIsDropdownVisible(false); // 드롭다운 닫기
        onDeleteFolder(e); // 폴더 삭제 함수 호출
    };

    const handleRenameFolder = (e) => {
        e.stopPropagation();
        setIsDropdownVisible(false); // 드롭다운 닫기
        onRenameFolder(e); // 폴더 삭제 함수 호출
    };

    return (
        <StyledCard onClick={onCardClick}>
            <CardImage 
                src={img}
                alt={title}
            />
            {type === 'folder' && (
                <CardInfoAndIcon>
                    <CardTitle>{title}</CardTitle>
                    <MenuIcon 
                        src={menuIcon}
                        alt='menu'
                        onClick={ (e) => onToggleDropdown(e) }
                    />
                    {isDropdownVisible && (
                        <StyledDropdown>
                            <DropdownMenu onClick={handleDeleteFolder}>삭제</DropdownMenu>
                            <DropdownMenu onClick={handleRenameFolder}>이름 변경</DropdownMenu>
                        </StyledDropdown>
                    )}
                </CardInfoAndIcon>
            )}
            {type === 'scrap' && (
                <CardInfoAndIcon>
                    <CardInfo>
                        <CardTitle>{title}</CardTitle>
                        <CardDate>{date}</CardDate>
                    </CardInfo>
                    <DeleteIcon
                        src={trashIcon}
                        alt='delete'
                        onClick={onDeleteScrap}
                    />
                </CardInfoAndIcon>
            )}
        </StyledCard>
    );
}