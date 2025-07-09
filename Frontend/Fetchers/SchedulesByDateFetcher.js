
async function fetchScheduleByDate () {
    const url = 'http://192.168.88.10:6969/schedulesByDate';
    try {
        //const fullDate = new Date();
        const date = "2025-07-07";
        //const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`

        const params = new URLSearchParams();
        params.append("date", date);

        const response = await fetch(`${url}?${params}`);
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