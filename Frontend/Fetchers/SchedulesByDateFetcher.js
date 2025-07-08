
async function fetchScheduleByDate () {
    try {
        const fullDate = new Date();
        //const date = "2025-07-07";
        const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`

        const params = new URLSearchParams();
        params.append("date", date);

        const response = await fetch(`http://localhost:6969/schedulesByDateTime?${params}`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data:', data);
        return data;

    } catch (error) {
        console.error(error.message);
    }
}
fetchScheduleByDate();
export default fetchScheduleByDate;