// 전체, 조건별 여행일정 조회 API
export const getTrip = async (sortOrder) => {
    try {
        const response = await fetch(`https://yeogida.net/api/itineraries?sort=${sortOrder}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Error fetching trips');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching trips:', error);
        throw error;
    }
};

// 새로운 여행일정 생성 API
export const createItineraries = async (formData) => {
    try {
        const response = await fetch('https://yeogida.net/api/itineraries', {
            method: 'POST',
            body: formData, // FormData를 그대로 전달
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('HTTP 에러 발생:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const result = await response.json();
        console.log('여행 일정 등록 성공:', result);
        return result; // 결과 반환
    } catch (error) {
        console.error('Error in createItineraries:', error);
        throw error; // 에러를 상위로 전달
    }
};

// 특정 여행일정 조회 API
export const getItineraries = async (itinerary_id) => {
    try {
        const response = await fetch(`https://yeogida.net/api/itineraries/${itinerary_id}`);
        
        if (!response.ok) {
            throw new Error('일정 정보를 불러오는 데 실패했습니다.');
        }

        const data = await response.json(); // JSON 형태로 변환
        console.log(data); // 데이터 확인
        return data; // 필요한 경우 반환
    } catch (error) {
        console.error('API 호출 오류:', error);
    }
}; 

// 특정 여행일정 수정 API
export const updateItinerary = async (itineraryId, updatedData) => {
    try {
    const response = await fetch(`https://yeogida.net/api/itineraries/${itineraryId}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData), // 수정할 데이터
    });

    if (!response.ok) {
        throw new Error('여행 일정 수정에 실패했습니다.');
    }

    const result = await response.json(); // 성공 시 반환된 데이터를 JSON 형식으로 변환
    console.log('수정된 여행 일정:', result);
    } catch (error) {
    console.error('오류 발생:', error.message);
    }
};

// 특정 여행일정 삭제 API
export const deleteItinerary = async (itinerary_id) => {
    try {
        const response = await fetch(`https://yeogida.net/api/itineraries/${itinerary_id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('일정 삭제에 실패했습니다.');
        }

        alert('일정이 성공적으로 삭제되었습니다.');
    } catch (error) {
        console.error('오류:', error);
        alert('일정 삭제 중 오류가 발생했습니다.');
    }
};

// 지도의 장소 검색 API
export const handleSearch = async (searchQuery) => {
    if (!searchQuery) return []; // 검색어가 없으면 빈 배열 반환

    try {
        console.log('장소 검색 요청 시작');
        console.log(`검색어: ${searchQuery}`);

        const response = await fetch(`https://yeogida.net/api/places/search?query=${encodeURIComponent(searchQuery)}`);
        
        if (response.status === 404) {
            console.error('검색 결과가 없습니다.');
            return []; // 빈 배열 반환
        }

        if (!response.ok) {
            throw new Error('네트워크 응답이 실패했습니다.');
        }

        const data = await response.json();
        console.log('검색된 장소 결과:', data);

        return (data || []).map((item) => ({
            title: item.title,
            address: item.roadAddress,
            lat: item.mapx,
            lng: item.mapy,
        }));
    } catch (error) {
        console.error('장소 검색 중 오류 발생:', error);
        throw error;
    }
};