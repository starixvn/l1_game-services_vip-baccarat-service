import { Table } from "sc-game-base";

export default class SettleGameRoundConsumer extends Table.EventConsumers.SettleGameRoundConsumer {
    calculateBetResult(settlementResult, bet, odds) {
        const { choices } = this.definition;

        const betResult = Object.entries(settlementResult)
            .filter(([choice, win]) => choices.includes(choice))
            .reduce(
                (result, [choice, win]) => {
                    const betAmount = bet[choice];
                    const originalOdds = odds[choice] || 1;
                    const effectiveOdds = bet.freeBet ? originalOdds - 1 : originalOdds;
                    const winAmount = win ? betAmount * effectiveOdds : 0;

                    result.totalBetAmount += betAmount;
                    result.totalWin += winAmount;
                    result.winningByChoices[choice] = winAmount;

                    if (winAmount > 0) {
                        result.netWin += winAmount - betAmount;
                    } else {
                        result.totalLost += betAmount;
                    }

                    return result;
                },
                {
                    totalBetAmount: 0,
                    totalWin: 0,
                    netWin: 0,
                    totalLost: 0,
                    winningByChoices: {},
                }
            );

        betResult.totalWin = parseFloat(betResult.totalWin.toFixed(2));
        betResult.netWin = parseFloat(betResult.netWin.toFixed(2));

        return betResult;
    }
}
