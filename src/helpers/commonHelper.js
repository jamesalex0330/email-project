const axios = require("axios");
const { generateConfig } = require("../utils/utils");
export default {
    roundNumber(number, round = 2) {
        var roundVal = 100;
        if (round == 3) {
            roundVal = 1000;
        }
        return Math.round(number * roundVal) / roundVal;
    },

    async getSchemeData(schemeCode) {
        try {
            const url = `https://api.mfapi.in/mf/${schemeCode}`;
            const config = {
                method: "get",
                url: url,
                headers: {
                    "Content-type": "application/json",
                },
            };
            const response = await axios(config);
            return await response.data.data;
        } catch (error) {
            return [];
        }
    }
}
