async function fetchScheduleByClassIdForDate () {
    try {
        const classId = 1;
        const fullDate = new Date();
        //const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`
        const date = "2025-07-07";

        const params = new URLSearchParams();
        params.append("classId", classId);
        params.append("date", date);


        const response = await fetch(`http://localhost:6969/schedulesByClassIdForDate?${params}`);
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