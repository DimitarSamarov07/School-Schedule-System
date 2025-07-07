const fetchTime = async () => {
    try {
        const response = await fetch('http://localhost:6969/runningTime?Time');
        const data = await response.json();
        
        // This will show us what properties we actually have
        console.log('Available properties:', Object.keys(data));
        
        // This will show the full data object
        console.log('Data:', data);
        
    } catch (error) {
        console.error('Error:', error);
    }
};

fetchTime();