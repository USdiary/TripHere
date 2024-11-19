const BASE_URL = 'https://yeogida.net';

/* 스크랩 폴더 목록 조회 */
export const getFolderData = async () => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error "getFolderData":', error);
        throw error;
    }
};

/* 스크랩 폴더 생성 */
export const fetchFolderAdd = async (folderName) => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                folderName
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchFolderAdd":', error);
        throw error;
    }
};

/* 스크랩 폴더 삭제 */
export const fetchFolderDelete = async (folderId) => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap/delete/${folderId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchFolderDelete":', error);
        throw error;
    }
};

/* 스크랩 폴더 이름 수정 */
export const fetchFolderNameUpdate = async (folderId, folderName) => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap/rename/${folderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                folderId, folderName
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchFolderNameUpdate":', error);
        throw error;
    }
};

/* 특정 스크랩 폴더의 스크랩 목록 조회 */
export const getScrapData = async (folderId) => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap/${folderId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error "getScrapData":', error);
        throw error;
    }
};

/* 특정 스크랩 삭제 */
export const fetchScrapDelete = async (folderId, scrapId) => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/scrap/${folderId}/delete/${scrapId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchScrapDelete":', error);
        throw error;
    }
};