

async function fetchScheduleByDateAndTime () {
    const url = 'http://192.168.88.10:6969/schedulesByDateTime';
    try {
        // const fullDate = new Date();
        // const time = (await fetchTime()).data.currentTime.startTime;
        // const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`
        const time = "8:01";
        const date = "2025-07-07";
        
        const params = new URLSearchParams();
        params.append("date", date);
        params.append("time", time);
        
        const response = await fetch(`${url}?${params}`);
        const data = await response.json();
        console.log('Data:', data);
        return data;
        
    } catch (error) {
        console.error(error.message);
    }
}

fetchScheduleByDateAndTime()