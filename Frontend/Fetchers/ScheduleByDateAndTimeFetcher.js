import fetchTime from './TimesFetcher.js';

async function fetchScheduleByDateAndTime () {
    try {
        const time = (await fetchTime()).data.currentTime.startTime;
        const date = "2025-03-07";
        
        const params = new URLSearchParams();
        params.append("date", date);
        params.append("time", time);
        
        const response = await fetch(`http://localhost:6969/schedulesByDateTime?${params}`);
        const data = await response.json();
        console.log('Data:', data);
        
    } catch (error) {
        console.error(error.message);
    }
}

fetchScheduleByDateAndTime()

export default fetchScheduleByDateAndTime;