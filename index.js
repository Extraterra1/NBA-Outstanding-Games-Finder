const axios = require("axios");

const regSeason = async () => {
  const gamesList = await axios.get("https://www.balldontlie.io/api/v1/games?start_date=2019-11-08&end_date=2019-11-08");
  let gamesToWatch = [];
  const analyzeStats = new Promise((resolve, reject) => {
    gamesList.data.data.forEach(async (el, i, array) => {
      const res = await axios.get(`https://www.balldontlie.io/api/v1/stats?game_ids[]=${el.id}&per_page=100`);
      res.data.data.forEach((el) => {
        if (el.pts > 45 || (el.player.last_name === "Doncic" && (el.pts > 30 || el.ast > 15))) {
          gamesToWatch.push(el.game.id);
        }
      });
      if (i === array.length - 1) resolve();
    });
  });
  analyzeStats.then(() => {
    if (gamesToWatch.length === 0) console.log("No games stand out.");
    gamesList.data.data.forEach((el) => {
      if (gamesToWatch.includes(el.id)) {
        console.log(`You should probably watch ${el.visitor_team.abbreviation} @ ${el.home_team.abbreviation}`);
      }
    });
  });
};

regSeason();
