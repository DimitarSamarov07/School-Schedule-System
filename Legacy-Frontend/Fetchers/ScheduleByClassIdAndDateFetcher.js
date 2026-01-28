async function fetchScheduleByClassIdForDate () {
    const url = 'http://192.168.88.12:6969/schedulesByClassIdForDate';
    try {
        const classId = 1;
        //const fullDate = new Date();
        //const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`
        const date = "2025-07-07";

        const params = new URLSearchParams();
        params.append("classId", classId);
        params.append("date", date);


        const response = await fetch(`${url}?${params}`);
        const data = await response.json();
        console.log('Data:', data);
        console.log('classId');
        return data;

    } catch (error) {
        console.error(error.message);
    }
}

fetchScheduleByClassIdForDate()

export default fetchScheduleByClassIdForDate;