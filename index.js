document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("Search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".mid-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("mid-label");
    const hardLabel = document.getElementById("hard-label");
    const rankElement = document.getElementById("rank");
    const contributionElement = document.getElementById("contribution");
    const acceptanceRateElement = document.getElementById("acceptance-rate");

    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        return regex.test(username) || (alert("Invalid Username"), false);
    }

    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const targetUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
            const response = await fetch(targetUrl);

            if (!response.ok) throw new Error("Unable to fetch user details");

            const parsedData = await response.json();
            console.log("Fetched Data:", parsedData);
            displayUserData(parsedData);
        } catch (error) {
            statsContainer.innerHTML = "<p>No Data Found</p>";
            console.error("Error fetching data:", error);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressPercent = total > 0 ? (solved / total) * 100 : 0;
        circle.style.setProperty("--progress-degree", `${progressPercent}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData) {

        const totalEasyQues = parsedData.totalEasy || 1;
        const totalMediumQues = parsedData.totalMedium || 1;
        const totalHardQues = parsedData.totalHard || 1;

        const solvedEasyQues = parsedData.easySolved || 0;
        const solvedMediumQues = parsedData.mediumSolved || 0;
        const solvedHardQues = parsedData.hardSolved || 0;

        // Update Pie Chart 
        updateProgress(solvedEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHardQues, totalHardQues, hardLabel, hardProgressCircle);

        // Update Extra Stats
        rankElement.textContent = parsedData.ranking || "N/A";
        contributionElement.textContent = parsedData.contributionPoints || "0";
        acceptanceRateElement.textContent = parsedData.acceptanceRate
            ? `${parsedData.acceptanceRate.toFixed(2)}%`
            : "N/A";
    }

    searchButton.addEventListener("click", function () {
        const username = usernameInput.value.trim();
        if (validateUsername(username)) fetchUserDetails(username);
    });
});
