const fetcher = async (url: string) => {
    const res = await fetch(url, {
        // Allows the browser to send and receive cookies across different ports
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // If the status is not 200-299, throw an error
    if (!res.ok) {
        const errorInfo = await res.text();
        throw new Error(errorInfo || 'An error occurred while fetching the data.');
    }

    // Handle empty responses gracefully
    const text = await res.text();
    return text ? JSON.parse(text) : {};
};

export default fetcher;