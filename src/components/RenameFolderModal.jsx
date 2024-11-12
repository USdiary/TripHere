import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const ModalTitle = styled.div`
    font-size: 24px;
    font-weight: bold;
`;

const LabelAndInputWrapper = styled.div`
    display: flex;
    gap: 30px;
    align-items: center;
`;

const Label = styled.label`
    font-size: 20px;
    font-weight: bold;
`;

const Input = styled.input`
    width: 374px;
    height: 48px;
    padding: 0 16px;
    font-size: 16px;
    border: 1px solid #707070;
    border-radius: 8px;
    // margin-bottom: 20px;
    ::placeholder {
        color: #707070;
    }
    &:focus {
        outline: none;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 16px;
`;

const CancelButton = styled.button`
    width: 140px;
    height: 40px;
    font-size: 16px;
    background-color: #fff;
    color: #000;
    border: 1px solid #e9e9e9;
    border-radius: 8px;
    cursor: pointer;
`;

const ConfirmButton = styled.button`
    width: 140px;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    background-color: #59abe6;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
`;

Modal.setAppElement('#root');

export default function RenameFolderModal({
    isOpen,
    onRequestClose,
    onConfirm
}) {
    const [folderName, setFolderName] = useState("");

    const handleConfirm = () => {
        onConfirm(folderName); // 입력된 폴더 이름을 onConfirm에 전달
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="폴더 이름 변경하기"
            style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                content: {
                    width: "548px",
                    height: "323px",
                    borderRadius: "16px",
                    backgroundColor: "#fff",
                    inset: 'auto',
                    padding: '48px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                }
            }}
        >
            <ModalTitle>폴더 이름 변경하기</ModalTitle>
            <LabelAndInputWrapper>
                <Label>폴더명</Label>
                <Input
                    type="text"
                    placeholder="폴더명을 입력하세요."
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                />
            </LabelAndInputWrapper>
            <ButtonContainer>
                <CancelButton onClick={onRequestClose}>취소</CancelButton>
                <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
            </ButtonContainer>
        </Modal>
    );
}
