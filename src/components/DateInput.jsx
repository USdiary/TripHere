import React, { Component } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";

const StyledDatePickerWrapper = styled.div`
    .react-datepicker-wrapper {
        display: inline-block;
        padding: 0;
        border: 0;
    }

    .react-datepicker__input-container input {
        width: 300px;
        height: 44px;
        padding: 8px;
        margin-left: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 16px;
        color: #000;
        font-family: NanumGothic;
        background-color: #fff;
        
        &:focus {
            outline: none; /* 기본 포커스 윤곽선 제거 */
            border: 1px solid #424242; /* 포커스 시 테두리 색상 */
            background-color: #fff; /* 포커스 시 배경색 유지 */
        }
    }

    .react-datepicker__header {
        background-color: #F6F6F6; /* 헤더 배경색 조정 */
    }

    .react-datepicker__day {
        line-height: 2; /* 날짜 셀의 높이 조정 */
    }

    .react-datepicker__day:hover{
        background-color: #0D90EE;
        color: black;
    }

    .react-datepicker__current-month {
        font-size: 16px; /* 현재 월의 글자 크기 조정 */
    }

    .react-datepicker__day--selected {
        background-color: #59ABE6; /* 선택된 날짜의 배경색 조정 */
        color: white; /* 선택된 날짜의 글자색 조정 */
    }

    .react-datepicker__day--in-range:hover,
    .react-datepicker__day--in-range {
        background-color: #59ABE6; /* 선택된 범위의 날짜 배경색 */
        color: white; /* 선택된 범위의 날짜 글자색 */
    }

    .react-datepicker__day--in-selecting-range,
    .react-datepicker__day--in-selecting-range:hover {
        background-color: #59ABE6; /* 선택 중 범위의 날짜 배경색 */
        color: white; /* 선택 중 범위의 날짜 글자색 */
    }

    .react-datepicker__day--range-start,
    .react-datepicker__day--range-end{
        background-color: #0D90EE; /* 범위의 끝 날짜 배경색 */
        color: white; /* 범위의 끝 날짜 글자색 */
    }
`;

export default class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
        };
    }
    
    setChangeDate = (dates) => {
        const [start, end] = dates;
        this.setState({ startDate: start, endDate: end }, () => {
            this.props.onDateRangeChange(this.state.startDate, this.state.endDate);
        });
    }
    
    render() {
        return (
            <StyledDatePickerWrapper> 
                <DatePicker 
                    selectsRange={true}
                    locale={ko}
                    dateFormat="yyyy년 MM월 dd일"
                    selected={this.state.startDate}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onChange={this.setChangeDate}
                />
            </StyledDatePickerWrapper>
        );
    }
}
