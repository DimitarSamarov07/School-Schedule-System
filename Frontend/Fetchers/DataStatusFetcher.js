async function fetchDataStatus() {
    try {
        const fullDate = new Date();
        //const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`
        const date = "2025-07-07";

        const params = new URLSearchParams();
        params.append("date", date);

        const response = await fetch(`http://localhost:6969/date?${params}`);
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