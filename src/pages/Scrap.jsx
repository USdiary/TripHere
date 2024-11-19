import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../components/ScrapCard';
import cardImg from './img/card_img.png';
import Modal from '../components/CommonModal';
import RenameFolderModal from '../components/RenameFolderModal';
import { getFolderData, fetchFolderAdd, fetchFolderDelete, fetchFolderNameUpdate, getScrapData, fetchScrapDelete } from '../api/Mypage/scrapAPI';

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
    line-height: 36px;
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
function ScrapFolders({ onSelectFolder }) {
    const [folderData, setFolderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [oneBtnModal, setOneBtnModal] = useState(false);
    const [twoBtnModal, setTwoBtnModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalChildren, setModalChildren] = useState('');
    const [thisFolderName, setThisFolderName] = useState('');
    const [folderIdToDelete, setFolderIdToDelete] = useState(null);
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [folderIdToRename, setFolderIdToRename] = useState(null);

    // 스크랩 폴더 목록 조회 API 연결
    useEffect(() => {
        const fetchFolderData = async () => {
            try {
                setLoading(true);
                const data = await getFolderData(); // 폴더 데이터 API 호출
                setFolderData(data); // 폴더 데이터 상태 설정
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFolderData();
    }, []);

    // 새 폴더 생성 함수
    const handleAddFolder = async () => {
        const newFolderName = '새 폴더';
        try {
            const newFolder = await fetchFolderAdd(newFolderName); 
            setFolderData([...folderData, newFolder]);
        } catch (err) {
            console.error('폴더 생성 중 오류 발생:', err);
            // 오류 처리 로직 추가 가능
        }
    };

    // 폴더 삭제 요청 Modal
    const handleDeleteFolder = (e, folderId, folderName) => {
        e.stopPropagation();
        setThisFolderName(folderName); // 폴더 이름 설정
        setFolderIdToDelete(folderId); // 삭제할 폴더 ID 설정
        setModalTitle('폴더를 삭제하시겠습니까?');
        setModalChildren('해당 폴더 속 일정 스크랩도 모두 삭제됩니다.');
        setTwoBtnModal(true); // 확인 모달 열기
    };

    // 폴더 삭제 완료 Modal
    const completeDeleteFolder = async () => {
        if (folderIdToDelete) {
            try {
                await fetchFolderDelete(folderIdToDelete); // API 호출로 폴더 삭제
                setFolderData(folderData.filter(folder => folder.folderId !== folderIdToDelete)); // 상태에서 삭제
                setModalTitle('폴더가 삭제되었습니다.');
                setOneBtnModal(true); // 삭제 완료 모달 열기
            } catch (err) {
                console.error('폴더 삭제 중 오류 발생:', err);
            } finally {
                setTwoBtnModal(false); // 확인 모달 닫기
                setFolderIdToDelete(null); // 삭제할 폴더 ID 초기화
            }
        }
    };

    // 폴더 이름 변경 요청 Modal
    const handleRenameFolder = (folderId) => {
        setFolderIdToRename(folderId); // 변경할 폴더 ID 설정
        setRenameModalOpen(true); // 폴더 이름 변경 모달 열기
    };

    // 폴더 이름 변경 완료
    const completeRenameFolder = async (newFolderName) => {
        if (folderIdToRename) {
            try {
                await fetchFolderNameUpdate(folderIdToRename, newFolderName); // API 호출로 폴더 이름 변경
                // 상태 업데이트
                setFolderData(
                    folderData.map(folder =>
                        folder.folderId === folderIdToRename
                            ? { ...folder, folderName: newFolderName }
                            : folder
                    )
                );
                setModalTitle('폴더 이름이 변경되었습니다.');
                setOneBtnModal(true);
            } catch (err) {
                console.error('폴더 이름 변경 중 오류 발생:', err);
            } finally {
                setRenameModalOpen(false); // 이름 변경 모달 닫기
                setFolderIdToRename(null);
            }
        }
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
                                onDeleteFolder={(e) => handleDeleteFolder(e, folder.folderName)}
                                onRenameFolder={(e) => handleRenameFolder(e, folder.folderId)}
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
                onRequestClose={ () => setOneBtnModal(false) }
                title={modalTitle}
                type={1}
            />
            <Modal 
                isOpen={twoBtnModal} 
                onRequestClose={ () => setTwoBtnModal(false) }
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
    const [scrapData, setScrapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [oneBtnModal, setOneBtnModal] = useState(false);
    const [twoBtnModal, setTwoBtnModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [thisScrapName, setThisScrapName] = useState('');
    const [scrapIdToDelete, setScrapIdToDelete] = useState(null);

    // 특정 스크랩 폴더의 스크랩 목록 조회 api 연결
    useEffect(() => {
        const fetchScrapData = async () => {
            try {
                setLoading(true);
                const data = await getScrapData(selectedFolderId); // 선택된 폴더의 스크랩 목록 가져오기
                setScrapData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchScrapData();
    }, [selectedFolderId]);

    // 스크랩 삭제 요청 Modal
    const handleDeleteScrap = (scrapId, scrapName) => {
        setThisScrapName(scrapName);
        setScrapIdToDelete(scrapId);
        setModalTitle('스크랩을 삭제하시겠습니까?');
        setTwoBtnModal(true);
    };

    // 스크랩 삭제 완료 Modal
    const completeDeleteScrap = async () => {
        if (scrapIdToDelete !== null) {
            try {
                await fetchScrapDelete(selectedFolderId, scrapIdToDelete); // API 호출로 스크랩 삭제
                setScrapData(scrapData.filter(scrap => scrap.scrapId !== scrapIdToDelete)); // 상태에서 삭제
                setModalTitle('스크랩이 삭제되었습니다.');
                setOneBtnModal(true); // 삭제 완료 모달 열기
            } catch (err) {
                console.error('스크랩 삭제 중 오류 발생:', err);
            } finally {
                setTwoBtnModal(false); // 확인 모달 닫기
                setScrapIdToDelete(null); // 삭제할 스크랩 ID 초기화
            }
        }
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
                                onDeleteScrap={() => handleDeleteScrap(scrap.scrapId, scrap.scrapName)}
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
                onRequestClose={ () => setOneBtnModal(false) }
                title={modalTitle}
                type={1}
            />
            <Modal 
                isOpen={twoBtnModal} 
                onRequestClose={ () => setTwoBtnModal(false) }
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