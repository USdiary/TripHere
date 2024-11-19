const BASE_URL = 'https://yeogida.net';

/* 친구 목록 조회 (최신순, 이름순) */
export const getFriendList = async (sortOption) => {
    try {
        const url = sortOption === 1 
            ? `${BASE_URL}/mypage/friend?status=recent`
            : `${BASE_URL}/mypage/friend?status=name`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error "getFriendList":', error);
        throw error;
    }
};

/* 친구 삭제 */
export const deleteFriend = async (friendId) => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/friend/${friendId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete friend');
        }
        return await response.json();
    } catch (error) {
        console.error('Error "deleteFriend":', error);
        throw error;
    }
};

/* 친구 요청 목록 조회 */
export const getFriendRequest = async () => {
    try {
        const res = await fetch(`${BASE_URL}/mypage/friend/friendrequest`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error "getFriendRequest":', error);
        throw error;
    }
};

/* 친구 요청 승낙 */
export const fetchFriendRequestAccept = async (friendId) => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/friend/friendrequest/accept`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                friendId,
                friendStatus: 1, // 항상 1로 설정
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to accept friend request');
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchFriendRequestAccept":', error);
        throw error;
    }
};

/* 친구 요청 거절 */ 
export const fetchFriendRequestReject = async (friendId) => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/friend/friendrequest/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                friendId,
                friendStatus: 1, // 항상 1로 설정
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to reject friend request');
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchFriendRequestReject":', error);
        throw error;
    }
};

/* 친구 검색 */ 
export const getSearchedFriend = async (userId) => {
    try {
        const res = await fetch(`${BASE_URL}/mypage/friend?search=${userId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error "getSearchedFriend":', error);
        throw error;
    }
};

/* 친구 추가 */ 
export const fetchAddFriend = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/mypage/friend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId
            }),
        });
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found'); // 404 에러 처리
            }
            throw new Error('Failed to add friend');
        }
        return await response.json();
    } catch (error) {
        console.error('Error "fetchAddFriend":', error);
        throw error;
    }
};