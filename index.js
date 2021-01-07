const axios = require("axios");
const moment = require("moment");

const date = moment().subtract(1, "days").format("YYYY-MM-DD");

const regSeason = async () => {
  const gamesList = await axios.get(`https://www.balldontlie.io/api/v1/games?start_date=${date}&end_date=${date}`);
  let gamesToWatch = [];
  const analyzeStats = new Promise((resolve, reject) => {
    gamesList.data.data.forEach(async (el, i, array) => {
      const res = await axios.get(`https://www.balldontlie.io/api/v1/stats?game_ids[]=${el.id}&per_page=100`);
      res.data.data.forEach((el) => {
        if ((el.pts > 45 && el.pts <= 50) || (el.player.last_name === "Doncic" && ((el.pts > 30 && el.pts <= 50) || (el.ast > 15 && el.ast < 20)))) {
          gamesToWatch.push({ id: el.game.id, greatGame: false });
        }
        if (el.pts > 50 || el.ast >= 20) {
          gamesToWatch.push({ id: el.game.id, greatGame: true });
        }
      });
      if (i === array.length - 1) resolve();
    });
  });
  analyzeStats.then(() => {
    if (gamesToWatch.length === 0) console.log("No games stand out.");
    gamesList.data.data.forEach((game) => {
      gamesToWatch.forEach((el) => {
        if (game.id === el.id) {
          if (el.greatGame) {
            console.log(`You should REALLY watch ${game.visitor_team.abbreviation} @ ${game.home_team.abbreviation}`);
          } else {
            console.log(`You should probably watch ${game.visitor_team.abbreviation} @ ${game.home_team.abbreviation}`);
          }
        }
      });
    });
  });
};

regSeason();
