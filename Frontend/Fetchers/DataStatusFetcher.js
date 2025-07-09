async function fetchDataStatus() {
    const url = 'http://192.168.88.10:6969/date';
    try {
        const fullDate = new Date();
        //const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`
        const date = "2025-07-07";

        const params = new URLSearchParams();
        params.append("date", date);

        const response = await fetch(`${url}?${params}`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        return json;

    } catch (error) {
        console.error(error.message);
    }
}
fetchDataStatus();

export default fetchDataStatus;