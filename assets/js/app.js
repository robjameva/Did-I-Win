var team = "NYJ"
var week = 1;

var AFCNum = 5;
var NFCNum = 5;
var qt1Payout = 100;
var qt2Payout = 150;
var qt3Payout = 100;
var qt4Payout = 300;

var homeScores = {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    overtime: null,
}

var awayScores = {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    overtime: null,
}

var teamsArray = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAX", "KC", "LAC",
    "LAR", "LV", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS"];





var getTeamData = function(team) {
    var key = "3e0e0d8d140747b997880c8e9c121ac8";
    var season = "2021";
    let apiUrl = `https://api.sportsdata.io/v3/nfl/scores/json/TeamGameStats/${season}/${week}?key=${key}`

    //localStorage.clear();
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        localStorage.setItem("ID" + i, JSON.stringify(data[i]));
                        if (data[i].Team === team) {
                            console.log("Selected Team " + data[i].Team);
                            console.log(data[i]);
                            getOpponentData(i, data[i].GameKey);
                            getSelectedTeamScore(data[i])
                        }
                    }
                    console.log(awayScores)
                    console.log(homeScores)
                });
            }
            else {
                alert("Games Not Found");
            }
        })
}

var getOpponentData = function(index, gameKey) {
    data = JSON.parse(localStorage.getItem("ID" + index));
    var opp = data.Opponent

    // Finds Team Data for the opponent in local storage
    for (var i = 0; i < localStorage.length; i++) {
        parsedData = JSON.parse(localStorage.getItem("ID" + i));
        // Check for the oppent team and select the matching game by gamekey to avoid dupilicates if a team plays another team more than once
        if (parsedData.Team === opp && data.GameKey === gameKey) {
            console.log("Opponent " + opp);
            console.log(parsedData);
            if (parsedData.HomeOrAway === "HOME") {
                homeScores.q1 = parsedData.ScoreQuarter1;
                homeScores.q2 = parsedData.ScoreQuarter2;
                homeScores.q3 = parsedData.ScoreQuarter3;
                homeScores.q4 = parsedData.ScoreQuarter4;
            } else {
                awayScores.q1 = parsedData.ScoreQuarter1;
                awayScores.q2 = parsedData.ScoreQuarter2;
                awayScores.q3 = parsedData.ScoreQuarter3;
                awayScores.q4 = parsedData.ScoreQuarter4;
            }
        }
    }
}

var getSelectedTeamScore = function(data) {

    if (data.HomeOrAway === "HOME") {
        homeScores.q1 = parsedData.ScoreQuarter1;
        homeScores.q2 = parsedData.ScoreQuarter2;
        homeScores.q3 = parsedData.ScoreQuarter3;
        homeScores.q4 = parsedData.ScoreQuarter4;
    } else {
        awayScores.q1 = parsedData.ScoreQuarter1;
        awayScores.q2 = parsedData.ScoreQuarter2;
        awayScores.q3 = parsedData.ScoreQuarter3;
        awayScores.q4 = parsedData.ScoreQuarter4;
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

getTeamData(team);
//getGif();