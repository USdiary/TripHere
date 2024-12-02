// 새로운 알림 생성 API
export const createAlarm = async (userId, itineraryId, status) => {
    try {
        const response = await fetch(`https://yeogida.net/alarms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                user_id: userId,
                itinerary_id: itineraryId,
                status: status
            }),
        });

        if (response.ok) {
            const newAlarm = await response.json();
            console.log('새로운 알림 생성 성공:', newAlarm);
            return newAlarm;
        } else {
            console.error('새로운 알림 생성 실패');
        }
    } catch (error) {
        console.error('API 호출 오류:', error);
    }
};

// 사용자 알림 조회
export const getUserAlarms = async (userId) => {
    try {
        const response = await fetch(`https://yeogida.net/alarms/${userId}`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error(`알림 조회 실패: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API 호출 오류:', error);
    }
};

// 알림 상태 업데이트
export const updateAlarm = async (alarmId, status) => {
    try {
        const response = await fetch(`https://yeogida.net/alarms/${alarmId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ status: status }),
        });

        if (response.ok) {
            const updatedAlarm = await response.json();
            console.log('알림 상태 업데이트 성공:', updatedAlarm);
            return updatedAlarm;
        } else {
            console.error('알림 상태 업데이트 실패');
        }
    } catch (error) {
        console.error('API 호출 오류:', error);
    }
};

// 알림 삭제
export const deleteAlarm = async (alarmId) => {
    try {
        const response = await fetch(`https://yeogida.net/alarms/${alarmId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            console.log('알림 삭제 성공');
            return true;
        } else {
            console.error('알림 삭제 실패');
            return false;
        }
    } catch (error) {
        console.error('API 호출 오류:', error);
    }
};