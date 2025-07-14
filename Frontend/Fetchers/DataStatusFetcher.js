async function fetchDataStatus() {
    const IsHoliday = document.getElementById("IsHoliday");
    const url = 'http://192.168.88.10:6969/date';
    try {
        // const fullDate = new Date();
        //const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`
        const date = "2025-01-06";

        const params = new URLSearchParams();
        params.append("date", date);

        const response = await fetch(`${url}?${params}`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        if(json.IsHoliday === 0){
            IsHoliday.innerHTML="False"
        }
        else{
            IsHoliday.innerHTML="True"
        }

        console.log(json);

    } catch (error) {
        console.error(error.message);
        IsHoliday.innerHTML="Problem"
    }
}
fetchDataStatus();
setInterval(fetchRunningTime, 1000*60*60);