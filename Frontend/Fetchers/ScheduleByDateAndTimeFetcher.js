import fetchTime from './TimesFetcher.js';

async function fetchScheduleByDateAndTime () {
    try {
        const fullDate = new Date();
        const time = (await fetchTime()).data.currentTime.startTime;
        const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`
        //const date = "2025-07-07";
        
        const params = new URLSearchParams();
        params.append("date", date);
        params.append("time", time);
        
        const response = await fetch(`http://localhost:6969/schedulesByDate?${params}`);
        const data = await response.json();
        console.log('Data:', data);
        return data;
        
    } catch (error) {
        console.error(error.message);
    }
}

fetchScheduleByDateAndTime()

export default fetchScheduleByDateAndTime;