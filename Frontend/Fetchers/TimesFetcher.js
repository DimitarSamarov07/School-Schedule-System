const fetchTime = async () => {
    try {
        const response = await fetch('http://localhost:6969/runningTime?Time', {
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Full response:', data); // See the complete response
        
        if (!data) {
            throw new Error('No data received from the server');
        }
        
        console.log(`Start: ${data.start}`);
        console.log(`End: ${data.end}`);
        console.log(`Period: ${data.schedule}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

fetchTime();