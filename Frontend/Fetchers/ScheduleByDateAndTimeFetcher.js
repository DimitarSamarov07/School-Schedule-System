let currentBatchIndex = 0;
const batchSize = 4;
let schedules = [];

// Function to display a specific batch of schedules (4)
function displayBatch() {
    const scheduleContainer = document.getElementById("scheduleContainer");
    scheduleContainer.innerHTML = ""; // Clear any existing content

    const startIndex = currentBatchIndex * batchSize;
    const endIndex = startIndex + batchSize;

    const currentBatch = schedules.slice(startIndex, endIndex);

    if (currentBatch.length === 0) {
        scheduleContainer.innerHTML = "<p>No schedules available.</p>";
        return;
    }

    // Render for each schedule as a row
    currentBatch.forEach(schedule => {
        const teacher = schedule?.Course?.Teacher || { FirstName: "N/A", LastName: "N/A" };
        const room = schedule?.Course?.Room || { Name: "N/A" };

        // Create a row for only this schedule
        const row = document.createElement("div");
        row.className = "schedule-row";

        // Add class name
        const classCell = document.createElement("div");
        classCell.className = "schedule-item";
        classCell.innerText = schedule?.Class?.Name || "N/A";
        row.appendChild(classCell);

        // Add course name
        const courseCell = document.createElement("div");
        courseCell.className = "schedule-item";
        courseCell.innerText = schedule?.Course?.Name || "N/A";
        row.appendChild(courseCell);

        // Add teacher name
        const teacherCell = document.createElement("div");
        teacherCell.className = "schedule-item";
        teacherCell.innerText = `${teacher.FirstName} ${teacher.LastName}`;
        row.appendChild(teacherCell);

        // Add room name
        const roomCell = document.createElement("div");
        roomCell.className = "schedule-item";
        roomCell.innerText = room.Name;
        row.appendChild(roomCell);

        // Append row to container
        scheduleContainer.appendChild(row);
    });

    currentBatchIndex = (currentBatchIndex + 1) % Math.ceil(schedules.length / batchSize);
}

// Function to fetch schedules and start rotating
async function fetchAndStartRotatingSchedules() {
    const url = 'http://192.168.88.10:6969/schedulesByDateTime';
    try {
        const time = "8:01";
        const date = "2025-07-07";

        // needs testing
        // const time = fetchRunningTime().endTime;
        //const fullDate = new Date();
        //const date = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()}`

        const params = new URLSearchParams();
        params.append("date", date);
        params.append("time", time);

        const response = await fetch(`${url}?${params}`);
        schedules = await response.json();

        displayBatch();

        setInterval(displayBatch, 30000);
    } catch (err) {
        console.error("Error fetching schedules:", err);
        document.getElementById("scheduleContainer").innerHTML = "Failed to load schedules.";
    }
}
document.addEventListener("DOMContentLoaded", fetchAndStartRotatingSchedules);