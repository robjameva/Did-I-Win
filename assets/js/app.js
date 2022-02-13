// HTML selectors
var gameWeekDropDownEl = document.getElementById("week-btn-list")
var gameWeekTitleEL = document.getElementById("week-dropdown")
var gameWeekEl = document.querySelector(".week-btn")

var teamDropDownEl = document.getElementById("team-btn-list")
var teamTitleEL = document.getElementById("team-dropdown")
var teamEl = document.querySelector(".team-btn")

var homeScoreDropDownEl = document.getElementById("home-score-btn-list")
var homeScoreTitleEL = document.getElementById("home-score-dropdown")
var homeScoreEl = document.querySelector(".home-score-btn")

var awayScoreDropDownEl = document.getElementById("away-score-btn-list")
var awayScoreTitleEL = document.getElementById("away-score-dropdown")
var awayScoreEl = document.querySelector(".away-score-btn")

var addToPoolBtnEL = document.getElementById("add-to-pool")
var watchListEL = document.getElementById("user-num-table")
var quarter1PayoutEL = document.getElementById("quarter-1-txt")
var quarter2PayoutEL = document.getElementById("quarter-2-txt")
var quarter3PayoutEL = document.getElementById("quarter-3-txt")
var quarter4PayoutEL = document.getElementById("quarter-4-txt")

var clearListBtnEL = document.getElementById("clear-btn")
var checkBoxesBtnEL = document.getElementById("check-boxes")

var iframeEL = document.getElementById("gif")

// Global Variables
var team = 'CIN';
var week = null;

var savedItemsID = 0;
var currentQuarter = null;
var isGameOver = null;
var IsOvertime = null;

var homeData = {
    team: 'Bengals',
    threevarter: 'CIN',
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    overtime: null,
}

var awayData = {
    team: 'Rams',
    threevarter: 'LAR',
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    overtime: null
}

// Main API Call to Sports Data IO
var getTeamData = function(team) {
    var key = "3e0e0d8d140747b997880c8e9c121ac8";
    var season = "2021POST";
    var apiUrl = `https://api.sportsdata.io/v3/nfl/scores/json/TeamGameStats/${season}/4?key=${key}`

    // In this API call we get the data for every game for the week that is specified in the URL
    // Each game data object is saved to session storage
    // We loop through each object and when we find the object matching the team that we selected then we save that Game Key to local storage
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        sessionStorage.setItem("ID" + i, JSON.stringify(data[i]));
                        if (data[i].Team === team) {
                            localStorage.setItem("GameKey", data[i].GameKey);
                        }
                    }
                    setLocalStorage();
                    setTeamData();
                    checkDropdownChildren();
                    renderScoreBtns();
                });
            }
            else {
                alert("Games Not Found");
            }
        })
}

// Sets local storage to save only the game objects for the selected team and their opponent by looking for the Game Key saved in the inital API call
var setLocalStorage = function() {
    var gameKey = localStorage.getItem("GameKey");
    for (var i = 0; i < sessionStorage.length - 1; i++) {
        var data = JSON.parse(sessionStorage.getItem("ID" + i));
        if (data.GameKey == gameKey) {
            localStorage.setItem(data.HomeOrAway, JSON.stringify(data));
        }

    }
}

// Sets the global obejcts for home and away teams with the relevent data from local storage
var setTeamData = function() {
    var homeTeamParsed = JSON.parse(localStorage.getItem("HOME"));
    var awayTeamParsed = JSON.parse(localStorage.getItem("AWAY"));


    if (!homeTeamParsed) return currentQuarter = 0;

    if (homeTeamParsed.Team != 'CIN') return currentQuarter = 0;


    homeData.team = homeTeamParsed.TeamName;
    homeData.threevarter = homeTeamParsed.Team;
    homeData.q1 = homeTeamParsed.ScoreQuarter1;
    homeData.q2 = homeTeamParsed.ScoreQuarter2;
    homeData.q3 = homeTeamParsed.ScoreQuarter3;
    homeData.q4 = homeTeamParsed.ScoreQuarter4;
    homeData.overtime = homeTeamParsed.ScoreOvertime;

    awayData.team = awayTeamParsed.TeamName;
    awayData.threevarter = awayTeamParsed.Team
    awayData.q1 = awayTeamParsed.ScoreQuarter1;
    awayData.q2 = awayTeamParsed.ScoreQuarter2;
    awayData.q3 = awayTeamParsed.ScoreQuarter3;
    awayData.q4 = awayTeamParsed.ScoreQuarter4;
    awayData.overtime = awayTeamParsed.ScoreOvertime;
}

// Dynamically creates score buttons for the dropdown to include the team name
var createScoreBtns = function(num, homeOrAway, team) {
    var scoreLi = document.createElement("li");
    var scoreBtn = document.createElement("button");
    scoreBtn.className = homeOrAway + "-score-btn";
    scoreBtn.textContent = team + ": " + num;
    scoreLi.appendChild(scoreBtn);

    if (homeOrAway === "home") {
        homeScoreDropDownEl.appendChild(scoreLi);
        homeScoreTitleEL.textContent = homeData.team;
        scoreBtn.setAttribute("data-home-score-", num);
    }
    else {
        awayScoreDropDownEl.appendChild(scoreLi);
        awayScoreTitleEL.textContent = awayData.team;
        scoreBtn.setAttribute("data-away-score-", num);
    }
}

// Checks if dropdown btns exisit and clears them
var checkDropdownChildren = function() {
    if (homeScoreDropDownEl.hasChildNodes && awayScoreDropDownEl.hasChildNodes) {
        homeScoreDropDownEl.innerHTML = "";
        awayScoreDropDownEl.innerHTML = "";
    }
}

// Function to call createScoreBtns for both the home and away teams
var renderScoreBtns = function() {
    for (var i = 0; i < 10; i++) {
        createScoreBtns(i, "home", 'Bengals');
        createScoreBtns(i, "away", 'Rams');
    }
}

var addToPoolWatchlist = function() {
    var homeScore = homeScoreTitleEL.getAttribute("data-home-score-")
    var awayScore = awayScoreTitleEL.getAttribute("data-away-score-")

    var tableRowEl = document.createElement("tr");
    var tableDataTeamsEl = document.createElement("td");
    var tableDataQ1El = document.createElement("td");
    var tableDataQ2El = document.createElement("td");
    var tableDataQ3El = document.createElement("td");
    var tableDataQ4El = document.createElement("td");

    tableDataTeamsEl.innerHTML = homeScoreTitleEL.textContent + "<br>" + awayScoreTitleEL.textContent;
    tableDataQ1El.innerHTML = "$" + quarter1PayoutEL.value;
    tableDataQ2El.innerHTML = "$" + quarter2PayoutEL.value;
    tableDataQ3El.innerHTML = "$" + quarter3PayoutEL.value;
    tableDataQ4El.innerHTML = "$" + quarter4PayoutEL.value;

    // Set each cell to hold the users numebrs
    tableDataQ1El.setAttribute("data-home-score", homeScore);
    tableDataQ1El.setAttribute("data-away-score", awayScore);

    tableDataQ2El.setAttribute("data-home-score", homeScore);
    tableDataQ2El.setAttribute("data-away-score", awayScore);

    tableDataQ3El.setAttribute("data-home-score", homeScore);
    tableDataQ3El.setAttribute("data-away-score", awayScore);

    tableDataQ4El.setAttribute("data-home-score", homeScore);
    tableDataQ4El.setAttribute("data-away-score", awayScore);

    tableRowEl.appendChild(tableDataTeamsEl);
    tableRowEl.appendChild(tableDataQ1El);
    tableRowEl.appendChild(tableDataQ2El);
    tableRowEl.appendChild(tableDataQ3El);
    tableRowEl.appendChild(tableDataQ4El);

    watchListEL.appendChild(tableRowEl);
    saveNumbersToLocalStorage();
}

var saveNumbersToLocalStorage = function() {
    var savedNumbers = {
        homeTeam: homeScoreTitleEL.textContent,
        homeScore: homeScoreTitleEL.getAttribute("data-home-score-"),
        awayScore: awayScoreTitleEL.getAttribute("data-away-score-"),
        awayTeam: awayScoreTitleEL.textContent,
        q1: quarter1PayoutEL.value,
        q2: quarter2PayoutEL.value,
        q3: quarter3PayoutEL.value,
        q4: quarter4PayoutEL.value,
    }


    localStorage.setItem(savedItemsID, JSON.stringify(savedNumbers))
    savedItemsID++
}

var loadPoolWatchlist = function(data) {
    var tableRowEl = document.createElement("tr");
    var tableDataTeamsEl = document.createElement("td");
    var tableDataQ1El = document.createElement("td");
    var tableDataQ2El = document.createElement("td");
    var tableDataQ3El = document.createElement("td");
    var tableDataQ4El = document.createElement("td");

    tableDataTeamsEl.innerHTML = data.homeTeam + "<br>" + data.awayTeam;
    tableDataQ1El.innerHTML = "$" + data.q1;
    tableDataQ2El.innerHTML = "$" + data.q2;
    tableDataQ3El.innerHTML = "$" + data.q3;
    tableDataQ4El.innerHTML = "$" + data.q4;

    // Set each cell to hold the users numebrs
    tableDataQ1El.setAttribute("data-home-score", data.homeScore);
    tableDataQ1El.setAttribute("data-away-score", data.awayScore);

    tableDataQ2El.setAttribute("data-home-score", data.homeScore);
    tableDataQ2El.setAttribute("data-away-score", data.awayScore);

    tableDataQ3El.setAttribute("data-home-score", data.homeScore);
    tableDataQ3El.setAttribute("data-away-score", data.awayScore);

    tableDataQ4El.setAttribute("data-home-score", data.homeScore);
    tableDataQ4El.setAttribute("data-away-score", data.awayScore);

    tableRowEl.appendChild(tableDataTeamsEl);
    tableRowEl.appendChild(tableDataQ1El);
    tableRowEl.appendChild(tableDataQ2El);
    tableRowEl.appendChild(tableDataQ3El);
    tableRowEl.appendChild(tableDataQ4El);

    watchListEL.appendChild(tableRowEl);
}

if (localStorage.getItem(0)) {
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(i) != null) {
            SavedData = JSON.parse(localStorage.getItem(i))
            loadPoolWatchlist(SavedData)
            savedItemsID++
        }


    }
}

var getQuarter = function(selectedTeam) {
    var key = "3e0e0d8d140747b997880c8e9c121ac8"
    var season = "2021POST";
    var apiUrl = `https://api.sportsdata.io/v3/nfl/pbp/json/PlayByPlay/${season}/4/${selectedTeam}?key=${key}`

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    currentQuarter = data.Quarters.length;
                    isGameOver = data.Score.IsOver;
                    IsOvertime = data.Score.IsOvertime;

                })
            }
        })
}

// Logic to check if the users numbers match the winning numbers
var didIWin = function() {
    // Get total score per quarter and only look at the last didgit
    setTeamData();
    var homeFirstQuarter = homeData.q1 % 10;
    var homeSecondQuarter = (homeData.q1 + homeData.q2) % 10;
    var homeThirdQuarter = (homeData.q1 + homeData.q2 + homeData.q3) % 10;
    var homeFourthQuarter = (homeData.q1 + homeData.q2 + homeData.q3 + homeData.q4) % 10;
    var homeovertime = (homeData.q1 + homeData.q2 + homeData.q3 + homeData.q4 + homeData.overtime) % 10;

    var awayFirstQuarter = awayData.q1 % 10;
    var awaySecondQuarter = (awayData.q1 + awayData.q2) % 10;
    var awayThirdQuarter = (awayData.q1 + awayData.q2 + awayData.q3) % 10;
    var awayFourthQuarter = (awayData.q1 + awayData.q2 + awayData.q3 + awayData.q4) % 10;
    var awayOvertime = (awayData.q1 + awayData.q2 + awayData.q3 + awayData.q4 + awayData.overtime) % 10;

    console.log(homeFirstQuarter, homeSecondQuarter, homeThirdQuarter, homeFourthQuarter, homeovertime)
    console.log(awayFirstQuarter, awaySecondQuarter, awayThirdQuarter, awayFourthQuarter, awayOvertime)

    for (var i = 0, row; row = watchListEL.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            var col = row.cells[j]
            //iterate through columns
            //columns would be accessed using the "col" variable assigned in the for loop
            var homeNum = col.getAttribute("data-home-score");
            var awayNum = col.getAttribute("data-away-score");


            // Since the same numbers can win multiple quarters we check each quarter against our numbers with individual if statements
            if (j == 1 && homeNum == homeFirstQuarter && awayNum == awayFirstQuarter && currentQuarter >= 2 && currentQuarter != 0) {
                col.setAttribute("style", "background-color:lightgreen")
                launchGif();
            } else if (j != 0) {
                col.setAttribute("style", "background-color:lightcoral")
            }
            if (j == 2 && homeNum == homeSecondQuarter && awayNum == awaySecondQuarter && currentQuarter >= 3) {
                col.setAttribute("style", "background-color:lightgreen")
                launchGif();
            }
            if (j == 3 && homeNum == homeThirdQuarter && awayNum == awayThirdQuarter && currentQuarter >= 4) {
                col.setAttribute("style", "background-color:lightgreen")
                launchGif();
            }
            if (!IsOvertime) {
                if (j == 4 && homeNum == homeFourthQuarter && awayNum == awayFourthQuarter && isGameOver) {
                    col.setAttribute("style", "background-color:lightgreen")
                    launchGif();
                }
            } else {
                if (j == 4 && homeNum == homeovertime && awayNum == awayOvertime && isGameOver) {
                    col.setAttribute("style", "background-color:lightgreen")
                    launchGif();
                }
            }
        }
    }
}

// Gihy API call to get a random GIF with the search term "Win"
var getGif = function() {
    var key = "fQZBkKj2uURFmvRafbYRbv2aDkkmDEWf"
    var apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=win&limit=25&offset=0&rating=g&lang=en`

    var randomNum = Math.floor(Math.random() * 25)
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    iframeEL.setAttribute("src", data.data[randomNum].images.fixed_height.url)
                });
            }

        })
}

// Function used to show the modal that contains the gif
function launchGif() {
    getGif()
    myModal.show()
}

// Initializes the modal
var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false
})

// Removes line items from pool and local storage
var clearPool = function() {
    watchListEL.innerHTML = "";

    for (var i = 0; i < savedItemsID; i++) {
        if (localStorage.getItem(i)) {
            localStorage.removeItem(i)
        }
    }
    savedItemsID = 0;
}


// Event Listeners
// gameWeekDropDownEl.addEventListener("click", function(event) {
//     var btn = event.target;
//     gameWeekTitleEL.textContent = btn.textContent;
//     week = btn.getAttribute("data-week-num")
//     if (team != null) {
//         getTeamData(team);
//     }
// })

// teamDropDownEl.addEventListener("click", function(event) {
//     var btn = event.target;
//     teamTitleEL.textContent = btn.textContent;
//     team = btn.getAttribute("data-team")
//     getTeamData(team);
// })

getTeamData(team);

homeScoreDropDownEl.addEventListener("click", function(event) {
    var btn = event.target;
    var value = btn.getAttribute("data-home-score-")
    homeScoreTitleEL.setAttribute("data-home-score-", value)
    homeScoreTitleEL.textContent = btn.textContent;
})

awayScoreDropDownEl.addEventListener("click", function(event) {
    var btn = event.target;
    var value = btn.getAttribute("data-away-score-")
    awayScoreTitleEL.setAttribute("data-away-score-", value)
    awayScoreTitleEL.textContent = btn.textContent;
})

addToPoolBtnEL.addEventListener("click", addToPoolWatchlist)

clearListBtnEL.addEventListener("click", clearPool)

checkBoxesBtnEL.addEventListener("click", didIWin)

// Calls the SportsDataIO API to get the live current quarter
currentQuarter = getQuarter(team);