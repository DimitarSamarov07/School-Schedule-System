async function fetchRunningTime() {
    const url = 'http://192.168.88.10:6969/runningTime';
    const runningTime = document.getElementById("runningTime");

    try {
        const response = await fetch(url);

        if (!response.ok) {
             console.error(new Error(`Response status: ${response.status}`));
        }

        const json = await response.json();
        const {numberInSchedule, startTime, endTime} = json.currentHour;
        if (numberInSchedule === -1) {
            runningTime.innerHTML =
                `Междучасие от ${startTime} до ${endTime}`;
        } else if (numberInSchedule === 0 && startTime == null && endTime == null) {
            runningTime.innerHTML =
                `Неучебно време`;
        } else {
            runningTime.innerHTML = ` ${numberInSchedule} час - ${startTime} до ${endTime}`;
        }

    } catch (error) {
        console.error("Fetch error:", error.message);
        document.getElementById("runningTime").innerHTML = "Failed to load time.";
    }
}

fetchRunningTime();
setInterval(fetchRunningTime, 5000);