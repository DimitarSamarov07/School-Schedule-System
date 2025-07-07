const fetchTime = () => {
    fetch('http://localhost:6969/runningTime?Time', {
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Start Time:', data.currentHour.startTime);
        console.log('Number in Schedule:', data.currentHour.numberInSchedule);
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
};

fetchTime();