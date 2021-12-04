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


var team = null;
var week = null;

var homeNum = 3;
var awayNum = 8;
var qt1Payout = 100;
var qt2Payout = 150;
var qt3Payout = 100;
var qt4Payout = 300;

var homeScores = {
    team: null,
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    overtime: null,
}

var awayScores = {
    team: null,
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    overtime: null
}

var teamsArray = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAX", "KC", "LAC",
    "LAR", "LV", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];





var getTeamData = function(team) {
    var key = "3e0e0d8d140747b997880c8e9c121ac8";
    var season = "2021";
    let apiUrl = `https://api.sportsdata.io/v3/nfl/scores/json/TeamGameStats/${season}/${week}?key=${key}`

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        sessionStorage.setItem("ID" + i, JSON.stringify(data[i]));
                        if (data[i].Team === team) {
                            localStorage.setItem("GameKey", data[i].GameKey)
                        }
                    }
                    setLocalStorage();
                    setTeamData();
                    checkDropdownChildren();
                    renderScoreBtns();
                    didIWin();
                });
            }
            else {
                alert("Games Not Found");
            }
        })
}




// Sets local storage to save only the game objects for the selected team and their opponent
var setLocalStorage = function() {
    var gameKey = localStorage.getItem("GameKey");
    for (var i = 0; i < sessionStorage.length; i++) {
        data = JSON.parse(sessionStorage.getItem("ID" + i));
        if (data.GameKey == gameKey) {
            localStorage.setItem(data.HomeOrAway, JSON.stringify(data));
        }

    }
}

var setTeamData = function() {
    var homeTeamData = localStorage.getItem("HOME");
    var awayTeamData = localStorage.getItem("AWAY");
    var homeTeamParsed = JSON.parse(homeTeamData);
    var awayTeamParsed = JSON.parse(awayTeamData);

    homeScores.team = homeTeamParsed.TeamName;
    homeScores.q1 = homeTeamParsed.ScoreQuarter1;
    homeScores.q2 = homeTeamParsed.ScoreQuarter2;
    homeScores.q3 = homeTeamParsed.ScoreQuarter3;
    homeScores.q4 = homeTeamParsed.ScoreQuarter4;

    awayScores.team = awayTeamParsed.TeamName;
    awayScores.q1 = awayTeamParsed.ScoreQuarter1;
    awayScores.q2 = awayTeamParsed.ScoreQuarter2;
    awayScores.q3 = awayTeamParsed.ScoreQuarter3;
    awayScores.q4 = awayTeamParsed.ScoreQuarter4;
}

var didIWin = function() {
    // Get total score per quarter and only look at the last didgit
    var homeFirstQuarter = homeScores.q1 % 10;
    var homeSecondQuarter = (homeScores.q1 + homeScores.q2) % 10;
    var homeThirdQuarter = (homeScores.q1 + homeScores.q2 + homeScores.q3) % 10;
    var homeFourthQuarter = (homeScores.q1 + homeScores.q2 + homeScores.q3 + homeScores.q4) % 10;

    var awayFirstQuarter = awayScores.q1 % 10;
    var awaySecondQuarter = (awayScores.q1 + awayScores.q2) % 10;
    var awayThirdQuarter = (awayScores.q1 + awayScores.q2 + awayScores.q3) % 10;
    var awayFourthQuarter = (awayScores.q1 + awayScores.q2 + awayScores.q3 + awayScores.q4) % 10;

    console.log(homeFirstQuarter, homeSecondQuarter, homeThirdQuarter, homeFourthQuarter)
    console.log(awayFirstQuarter, awaySecondQuarter, awayThirdQuarter, awayFourthQuarter)

    if (homeNum === homeFirstQuarter && awayNum === awayFirstQuarter) {
        console.log("You Won $" + qt1Payout)
    }

    if (homeNum === homeSecondQuarter && awayNum === awaySecondQuarter) {
        console.log("You Won $" + qt2Payout)
    }
    if (homeNum === homeThirdQuarter && awayNum === awayThirdQuarter) {
        console.log("You Won $" + qt3Payout)
    }
    if (homeNum === homeFourthQuarter && awayNum === awayFourthQuarter) {
        console.log("You Won $" + qt4Payout)
    }

}

var createScoreBtns = function(num, homeOrAway, team) {
    var scoreLi = document.createElement("li");
    var scoreBtn = document.createElement("button");
    scoreBtn.className = homeOrAway + "-score-btn";
    scoreBtn.textContent = team + " " + num;
    scoreLi.appendChild(scoreBtn);

    if (homeOrAway === "home") {
        homeScoreDropDownEl.appendChild(scoreLi);
        homeScoreTitleEL.textContent = homeScores.team;
    }
    else {
        awayScoreDropDownEl.appendChild(scoreLi);
        awayScoreTitleEL.textContent = awayScores.team;
    }
}

var checkDropdownChildren = function() {
    if (homeScoreDropDownEl.hasChildNodes && awayScoreDropDownEl.hasChildNodes) {
        homeScoreDropDownEl.innerHTML = "";
        awayScoreDropDownEl.innerHTML = "";
    }
}

var renderScoreBtns = function() {
    for (var i = 0; i < 10; i++) {
        createScoreBtns(i, "home", homeScores.team);
        createScoreBtns(i, "away", awayScores.team);
    }
}












var getGif = function() {
    var key = "fQZBkKj2uURFmvRafbYRbv2aDkkmDEWf"
    let apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=win&limit=25&offset=0&rating=g&lang=en`

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data.data[0].images.fixed_height.url)

                });
            }
            else {
                alert("City Not Found");
            }
        })
}


//getGif();



gameWeekDropDownEl.addEventListener("click", function(event) {
    var btn = event.target;
    gameWeekTitleEL.textContent = btn.textContent;
    week = btn.getAttribute("data-week-num")
    if (team != null) {
        getTeamData(team);
    }
})

teamDropDownEl.addEventListener("click", function(event) {
    var btn = event.target;
    teamTitleEL.textContent = btn.textContent;
    team = btn.getAttribute("data-team")
    getTeamData(team);
})

homeScoreDropDownEl.addEventListener("click", function(event) {
    var btn = event.target;
    homeScoreTitleEL.textContent = btn.textContent;
    console.log(btn)
})

awayScoreDropDownEl.addEventListener("click", function(event) {
    var btn = event.target;
    awayScoreTitleEL.textContent = btn.textContent;
    console.log(btn)
})


