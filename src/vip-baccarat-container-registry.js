import awilix from "awilix";
import { Table } from "sc-game-base";
import { PlaceBetConsumer, RoundResultConsumer, SettleGameRoundConsumer } from "./consumers";
import { Bot, VipBaccaratProcessBetQueue } from "./crons/index";
import { BetEventMetric } from "./metrics";
import { bets, hourlySummaries, results, rounds, tmpBets } from "./models/index";
import RTPQuery from "./query-apis/rtp-query";
import { VipBaccaratSocketRouter } from "./routers";

const { asClass, asValue } = awilix;

export default class VipBaccaratContainerRegistry extends Table.TableContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds),
            betsRepository: asValue(bets),
            tempBetsRepository: asValue(tmpBets),
            resultsRepository: asValue(results),
            hourlySummariesRepository: asValue(hourlySummaries),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            placeBetConsumer: asClass(PlaceBetConsumer).singleton(),
            settleGameRoundConsumer: asClass(SettleGameRoundConsumer).singleton().proxy(),
            roundResultConsumer: asClass(RoundResultConsumer).singleton(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            betEventMetric: asClass(BetEventMetric).singleton().proxy(),
        });

        this.container.register({
            bot: asClass(Bot).singleton(),
            processBetQueue: asClass(VipBaccaratProcessBetQueue).singleton().proxy(),
        });
    }

    registerRouters() {
        super.registerRouters();
        this.container.register({
            socketRouter: asClass(VipBaccaratSocketRouter).proxy(),
        });
    }

    registerApis() {
        super.registerApis();

        this.container.register({
            rtpQuery: asClass(RTPQuery).singleton(),
        });
    }
}
