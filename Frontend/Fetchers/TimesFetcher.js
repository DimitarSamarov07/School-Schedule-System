async function fetchRunningTime() {
    const url = 'http://localhost:6969/runningTime';
    const runningTime = document.getElementById("runningTime");

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        const {numberInSchedule,startTime, endTime } = json.currentHour;
        if (numberInSchedule === -1) {
            runningTime.innerHTML =
                `Междучасие от ${startTime} до ${endTime}`;
        }
        else{
            runningTime.innerHTML = numberInSchedule + `  час - ${startTime} до ${endTime}`;
        }

    } catch (error) {
        console.error("Fetch error:", error.message);
        document.getElementById("runningTime").innerHTML = "Failed to load time.";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchRunningTime();
    setInterval(fetchRunningTime, 10000);
});
