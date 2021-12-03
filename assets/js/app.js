var team = "NYJ"
var week = 12;
var AFCNum = 5;
var NFCNum = 5;
var qt1Payout = 100;
var qt2Payout = 150;
var qt3Payout = 100;
var qt4Payout = 300;

var teamsArray = ["ARI", "ATL", "BAL", "BUF", "CAR", "CHI", "CIN", "CLE", "DAL", "DEN", "DET", "GB", "HOU", "IND", "JAX", "KC", "LAC",
    "LAR", "LV", "MIA", "MIN", "NE", "NO", "NYG", "NYJ", "PHI", "PIT", "SEA", "SF", "TB", "TEN", "WAS",];



var getScore = function(team) {
    var key = "3e0e0d8d140747b997880c8e9c121ac8";
    var season = "2021";
    let apiUrl = `https://api.sportsdata.io/v3/nfl/scores/json/TeamGameStats/${season}/${week}?key=${key}`

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {

                    for (var i = 0; i < data.length; i++) {
                        localStorage.setItem("ID" + i, JSON.stringify(data[i]));
                        if (data[i].Team === team) {
                            console.log(data[i]);
                            getOpponent(i, team);
                        }
                    }

                });
            }
            else {
                alert("Games Not Found");
            }
        })
}

var getOpponent = function(index, team) {
    data = JSON.parse(localStorage.getItem("ID" + index));
    var opp = data.Opponent
    console.log(opp);

    // Finds Team Data for the opponent in local storage
    for (var i = 0; i < 30; i++) {
        parsedData = JSON.parse(localStorage.getItem("ID" + i));
        if (parsedData.Team === opp) {
            console.log(parsedData);
        }
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

getScore(team);
//getGif();