async function fetchTime() {
    const url = 'http://localhost:6969/runningTime?Time';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        return response.json();
    } catch (error) {
        console.error(error.message);
    }
}

export default fetchTime()