import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../components/ScrapCard';
import cardImg from './img/card_img.png';
import Modal from '../components/CommonModal';
import RenameFolderModal from '../components/RenameFolderModal';

// 임시 데이터 - 스크랩 폴더
const initialFolderData = [
    { folderId: 1, folderName: '부산' },
    { folderId: 2, folderName: '제주도' },
    { folderId: 3, folderName: '속초' },
    { folderId: 4, folderName: '경주' },
];

// 임시 데이터 - 스크랩
const initialScrapData = [
    { folderId: 1, folderName: '부산' , scrapId: 1, scrapName: '부산 여행 1', addDate: '2024-05-13' },
    { folderId: 1, folderName: '부산' , scrapId: 2, scrapName: '부산 여행 2', addDate: '2024-05-13' },
    { folderId: 1, folderName: '부산' , scrapId: 3, scrapName: '부산 여행 3', addDate: '2024-05-13' },
    { folderId: 1, folderName: '부산' , scrapId: 4, scrapName: '부산 여행 4', addDate: '2024-05-13' },
    { folderId: 1, folderName: '부산' , scrapId: 5, scrapName: '부산 여행 5', addDate: '2024-05-13' },
    { folderId: 1, folderName: '부산' , scrapId: 6, scrapName: '부산 여행 6', addDate: '2024-05-13' },
    { folderId: 1, folderName: '부산' , scrapId: 7, scrapName: '부산 여행 7', addDate: '2024-05-13' },
    { folderId: 1, folderName: '부산' , scrapId: 8, scrapName: '부산 여행 8', addDate: '2024-05-13' },
    { folderId: 1, folderName: '부산' , scrapId: 9, scrapName: '부산 여행 9', addDate: '2024-05-13' },
    { folderId: 1, folderName: '부산' , scrapId: 10, scrapName: '부산 여행 10', addDate: '2024-05-13' },
    { folderId: 2, folderName: '제주도' , scrapId: 1, scrapName: '제주도 여행 1', addDate: '2024-05-23' },
    { folderId: 2, folderName: '제주도' , scrapId: 2, scrapName: '제주도 여행 2', addDate: '2024-05-23' },
    { folderId: 2, folderName: '제주도' , scrapId: 3, scrapName: '제주도 여행 3', addDate: '2024-05-23' },
    { folderId: 2, folderName: '제주도' , scrapId: 4, scrapName: '제주도 여행 4', addDate: '2024-05-23' },
];

const HeaderStyle = styled.div`
    margin-top: 150px;
    margin-bottom: 50px;
    font-weight: bold;
    font-size: 40px;
    display: flex;
    justify-content: center;
`;

const ScrapContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ScrapMiniHeader = styled.div`
    width: 1275px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 16px 0;
    @media (max-width: 1275px) {
        width: 625px;
    }
`;

const ScrapNum = styled.div`
    background-color: #f6f6f6;
    border-radius: 20px;
    width: 93px;
    height: 34px;
    color: #000;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    line-height: 34px;
`;

const FolderName = styled.span`
    font-weight: bold;
    font-size: 24px;
    line-height: 36px;
`;

const ScrapBtn = styled.span`
    border-radius: 3px;
    background-color: #59abe6;
    color: #fff;
    text-align: center;
    cursor: pointer;
    padding: 10px;
    line-height: normal;
    font-weight: bold;
    font-size: 16px;
`;

const ScrapCards = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 26px;
    min-height: 400px;
    align-items: center;
    margin-bottom: 20px;
`;

const EmptyMessage = styled.div`
    font-size: 24px;
    font-weight: bold;
    color: #e0e0e0;
    text-align: center;
    width: 100%;
`;

// ---------------폴더 Component---------------
// "ScrapFolders" 컴포넌트
function ScrapFolders({ onSelectFolder }) {
    const [folderData, setFolderData] = useState(initialFolderData);
    const [oneBtnModal, setOneBtnModal] = useState(false);
    const [twoBtnModal, setTwoBtnModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalChildren, setModalChildren] = useState('');
    const [thisFolderName, setThisFolderName] = useState('');
    const [folderIdToDelete, setFolderIdToDelete] = useState(null);
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [folderIdToRename, setFolderIdToRename] = useState(null);

    // 새 폴더 생성 함수
    const handleAddFolder = () => {
        const newFolder = { folderId: Date.now(), folderName: '새 폴더' };
        setFolderData([...folderData, newFolder]);
    };

    // 폴더 삭제 요청 Modal
    const handleDeleteFolder = (e, folderId, folderName) => {
        e.stopPropagation();
        setThisFolderName(folderName);
        setFolderIdToDelete(folderId);
        setModalTitle('폴더를 삭제하시겠습니까?');
        setModalChildren('해당 폴더 속 일정 스크랩도 모두 삭제됩니다.');
        setTwoBtnModal(true);
    };

    // 폴더 삭제 완료 Modal
    const completeDeleteFolder = () => {
        setFolderData(folderData.filter(folder => folder.folderId !== folderIdToDelete));
        setModalTitle('폴더가 삭제되었습니다.');
        setOneBtnModal(true);
        setTwoBtnModal(false);
        setFolderIdToDelete(null);
    };

    // 폴더 이름 변경 요청 Modal
    const handleRenameFolder = (folderId) => {
        setFolderIdToRename(folderId);
        setRenameModalOpen(true);
    };

    // 폴더 이름 변경 완료
    const completeRenameFolder = (newFolderName) => {
        setFolderData(folderData.map(folder =>
            folder.folderId === folderIdToRename ? { ...folder, folderName: newFolderName } : folder
        ));
        setModalTitle('폴더 이름이 변경되었습니다.');
        setOneBtnModal(true);
        setRenameModalOpen(false);
        setFolderIdToRename(null);
    };

    return (
        <>
            <ScrapContainer>
                <ScrapMiniHeader>
                    <ScrapNum>Total {folderData.length}</ScrapNum>
                    <ScrapBtn onClick={handleAddFolder}>새 폴더 생성</ScrapBtn>
                </ScrapMiniHeader>
                <ScrapCards>
                    {folderData.length > 0 ? (
                        folderData.map((folder) => (
                            <Card
                                key={folder.folderId}
                                type='folder'
                                img={cardImg}
                                title={folder.folderName}
                                onCardClick={() => onSelectFolder(folder.folderId, folder.folderName)}
                                onDeleteFolder={(e) => handleDeleteFolder(e, folder.folderId, folder.folderName)}
                                onRenameFolder={() => handleRenameFolder(folder.folderId)}
                            />
                        ))
                    ) : (
                        <EmptyMessage>empty</EmptyMessage>
                    )}
                </ScrapCards>
            </ScrapContainer>

            {/* Modals */}
            <Modal 
                isOpen={oneBtnModal} 
                onRequestClose={() => setOneBtnModal(false)}
                title={modalTitle}
                type={1}
            />
            <Modal 
                isOpen={twoBtnModal} 
                onRequestClose={() => setTwoBtnModal(false)}
                title={modalTitle}
                children={modalChildren}
                type={2}
                onConfirm={completeDeleteFolder}
            />
            <RenameFolderModal
                isOpen={renameModalOpen}
                onRequestClose={() => setRenameModalOpen(false)}
                onConfirm={completeRenameFolder}
            />
        </>
    );
}

// ---------------스크랩 Component---------------
function ScrapInFolder({ selectedFolderId, selectedFolderName, onBackToFolders }) {
    const [scrapData, setScrapData] = useState(initialScrapData.filter(scrap => scrap.folderId === selectedFolderId));
    const [oneBtnModal, setOneBtnModal] = useState(false);
    const [twoBtnModal, setTwoBtnModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [scrapIdToDelete, setScrapIdToDelete] = useState(null);

    // 스크랩 삭제 요청 Modal
    const handleDeleteScrap = (scrapId) => {
        setScrapIdToDelete(scrapId);
        setModalTitle('스크랩을 삭제하시겠습니까?');
        setTwoBtnModal(true);
    };

    // 스크랩 삭제 완료 Modal
    const completeDeleteScrap = () => {
        setScrapData(scrapData.filter(scrap => scrap.scrapId !== scrapIdToDelete));
        setModalTitle('스크랩이 삭제되었습니다.');
        setOneBtnModal(true);
        setTwoBtnModal(false);
        setScrapIdToDelete(null);
    };

    return (
        <>
            <ScrapContainer>
                <ScrapMiniHeader>
                    <ScrapNum>Total {scrapData.length}</ScrapNum>
                    <FolderName>in {selectedFolderName}</FolderName>
                    <ScrapBtn onClick={onBackToFolders}>폴더 선택</ScrapBtn>
                </ScrapMiniHeader>
                <ScrapCards>
                    {scrapData.length > 0 ? (
                        scrapData.map((scrap) => (
                            <Card
                                key={scrap.scrapId}
                                type='scrap'
                                img={cardImg}
                                title={scrap.scrapName}
                                date={scrap.addDate}
                                onDeleteScrap={() => handleDeleteScrap(scrap.scrapId)}
                            />
                        ))
                    ) : (
                        <EmptyMessage>empty</EmptyMessage>
                    )}
                </ScrapCards>
            </ScrapContainer>

            {/* Modals */}
            <Modal 
                isOpen={oneBtnModal} 
                onRequestClose={() => setOneBtnModal(false)}
                title={modalTitle}
                type={1}
            />
            <Modal 
                isOpen={twoBtnModal} 
                onRequestClose={() => setTwoBtnModal(false)}
                title={modalTitle}
                type={2}
                onConfirm={completeDeleteScrap}
            />
        </>
    );
}

export default function Scrap() {
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [selectedFolderName, setSelectedFolderName] = useState(null);

    const handleSelectFolder = (folderId, folderName) => {
        setSelectedFolderId(folderId);
        setSelectedFolderName(folderName);
    };

    const handleBackToFolders = () => {
        setSelectedFolderId(null);
    };

    return (
        <>
            <HeaderStyle>스크랩</HeaderStyle>
            {selectedFolderId === null ? (
                <ScrapFolders onSelectFolder={handleSelectFolder} />
            ) : (
                <ScrapInFolder selectedFolderId={selectedFolderId} selectedFolderName={selectedFolderName} onBackToFolders={handleBackToFolders} />
            )}
        </>
    );
}
