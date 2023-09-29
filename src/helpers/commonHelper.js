export default {
    roundNumber(number, round = 2) {
        var roundVal = 100;
        if (round == 3) {
            roundVal = 1000;
        }
        return Math.round(number * roundVal) / roundVal;
    }
}