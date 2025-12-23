// postRequests/createTeacher.js
export async function createTeacher(firstName, lastName) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ firstName, lastName });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    const response = await fetch("http://192.162.88.10:6969/teacher", requestOptions);
    if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
    }

    return response.text();
}
