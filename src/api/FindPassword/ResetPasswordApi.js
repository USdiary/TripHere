const apiRequest = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', ...options.headers },
            credentials: 'include',
            ...options,
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error occurred');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};
