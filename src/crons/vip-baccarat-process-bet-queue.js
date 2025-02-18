import { Table } from "sc-game-base";

export default class VipBaccaratProcessBetQueue extends Table.Crons.TableProcessBetQueue {
    constructor({
        definition,
        gameData,
        placeBetPublisher,
        placeBet,
        logService,
        betsRepository,
        betLogsRepository,
        userInfosRepository,
        baseMetrics,
        betEventMetric,
    }) {
        super({
            definition,
            gameData,
            placeBetPublisher,
            placeBet,
            logService,
            betsRepository,
            betLogsRepository,
            userInfosRepository,
            baseMetrics,
        });

        this.betEventMetric = betEventMetric;
    }

    async proceedBet(player, payload) {
        this.betEventMetric.collectEventLatency(payload);

        return super.proceedBet(player, payload);
    }

    isCountOnTotalBets(player) {
        return this.gameData.currencies.some(
            (currency) =>
                currency.partnerId === player.session.operatorId &&
                currency.name === player.session.currencyName &&
                !(currency.isTest && currency.isUncountOnTotal)
        );
    }
}
