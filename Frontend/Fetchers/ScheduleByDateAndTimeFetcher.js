let currentBatchIndex = 0;
const batchSize = 4;
let schedules = [];

// Function to display a specific batch of schedules (4)
function displayBatch() {
    const scheduleContainer = document.getElementById("scheduleContainer");
    scheduleContainer.innerHTML = ""; // Clear existing schedules

    const startIndex = currentBatchIndex * batchSize;
    const endIndex = startIndex + batchSize;

    const currentBatch = schedules.slice(startIndex, endIndex);

    if (currentBatch.length === 0) {
        scheduleContainer.innerHTML = "No schedules available.";
        return;
    }

    // Render each schedule in the batch
    currentBatch.forEach(schedule => {
        const teacher = schedule?.Course?.Teacher || { id: "N/A", FirstName: "N/A", LastName: "N/A" };
        const room = schedule?.Course.Room || { id: "N/A", Name: "N/A" ,Floor: "N/A"};
        const scheduleDiv = document.createElement("div");
        scheduleDiv.className = "schedule-item";
        scheduleDiv.innerHTML = `
            <p>${schedule?.Class?.Name || "N/A"}</p>
            <p>${schedule?.Course?.Name || "N/A"}</p>
            <p>${teacher.FirstName}  ${teacher.LastName}</p>
            <p> ${schedule?.Course?.Room?.Name || "N/A"}</p>
        `;
        scheduleContainer.appendChild(scheduleDiv);
    });

    // Update the batch index for the next rotation
    currentBatchIndex = (currentBatchIndex + 1) % Math.ceil(schedules.length / batchSize);
}

// Function to fetch schedules and start rotating
async function fetchAndStartRotatingSchedules() {
    const url = 'http://192.168.88.124:6969/schedulesByDateTime';
    try {
        const time = "8:01";
        const date = "2025-07-07";

        const params = new URLSearchParams();
        params.append("date", date);
        params.append("time", time);

        const response = await fetch(`${url}?${params}`);
        schedules = await response.json();

        // Start displaying the first batch
        displayBatch();

        // Rotate every 30 seconds
        setInterval(displayBatch, 30000);
    } catch (err) {
        console.error("Error fetching schedules:", err);
        document.getElementById("scheduleContainer").innerHTML = "Failed to load schedules.";
    }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", fetchAndStartRotatingSchedules);
