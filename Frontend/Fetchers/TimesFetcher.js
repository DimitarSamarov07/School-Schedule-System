const fetchTime = async () => {
    try {
        const response = await fetch('http://localhost:6969/runningTime?Time', {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data) {
            throw new Error('No data received from the server');
        }

        // Log the complete data structure
        console.log(JSON.stringify(data, null, 2));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
};

fetchTime();