import React , { useState } from 'react';
import styled from 'styled-components';
import downArrowIcon from '../assets/icons/down_arrow_icon.png';

const SortButton = styled.div `
    position: relative;
    width: 132px;
    height: 40px;
    border: 2px solid #707070;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    // box-sizing: border-box;
    z-index: 10;
`;

const SpanStyle = styled.span `
    font-size: 16px;
    padding-left: 12px;
    user-select: none; // 드래그 방지
`;

const IconStyle = styled.img `
    width: 10px;
    // height: 5px;
    margin-right: 22px;
    user-select: none;
    transform: ${({ viewDropdown }) => (viewDropdown ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const StyledDropdown = styled.div `
    position: absolute;
    top: 46px;
    width: 132px;
    height: 89px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    z-index: 1000;
`;

const MenuStyle = styled.div `
    width: 100%;
    height: 44px;
    line-height: 44px;
    padding-left: 16px;
    box-sizing: border-box;
    user-select: none;
`;

const HrStyle = styled.hr `
    margin: 0;
    height: 1px;
    border: 0;
    background-color: #e0e0e0;
    color: red;
`;

export default function SortDropdown({ firstMenu, secondMenu, handleMenuClick }) {
    const [viewDropdown, setViewDropdown] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(firstMenu);

    const handleMenuSelection = (menu) => {
        setSelectedMenu(menu);
        handleMenuClick(menu === firstMenu ? 1 : 2);
        setViewDropdown(false);
    }

    return (
        <SortButton
            onClick={ () => setViewDropdown(!viewDropdown) }
        >
            <SpanStyle>{ selectedMenu }</SpanStyle>
            <IconStyle
                src={downArrowIcon}
                alt='아래 방향 화살표'
                viewDropdown={viewDropdown}
            />
            {viewDropdown && (
                <StyledDropdown>
                    <MenuStyle
                        onClick={ () => handleMenuSelection(firstMenu) }
                    >{ firstMenu }</MenuStyle>
                    <HrStyle />
                    <MenuStyle 
                        onClick={ () => handleMenuSelection(secondMenu) }
                    >{ secondMenu }</MenuStyle>
                </StyledDropdown>
            )}
        </SortButton>
    )
}