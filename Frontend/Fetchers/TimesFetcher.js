async function fetchTime() {
    const url = 'http://localhost:6969/runningTime?Time';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        document.getElementById('class-time2').textContent = `${json.startTime} - ${json.endTime}`;
        return json;


    } catch (error) {
        console.error(error.message);
    }
}
fetchTime();
setInterval(fetchTime, 1000);
// async function fetchTimeToBrowser(){
//     let fetcher =fetchTime();
//     document.getElementById('class-time').textContent = `${fetcher.startTime} - ${fetcher.endTime}`;
// }

// export default fetchTime;
