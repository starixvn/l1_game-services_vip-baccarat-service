import awilix from "awilix";
import { Table } from "sc-game-base";
import { SettleGameRoundConsumer, RoundResultConsumer, PlaceBetConsumer } from "./consumers";
import { bets, rounds, tmpBets, results } from "./models/index";
import { Bot, VipBaccaratProcessBetQueue } from "./crons/index";
import { VipBaccaratSocketRouter } from "./routers";
import { BetEventMetric } from "./metrics";

const { asClass, asValue } = awilix;

export default class VipBaccaratContainerRegistry extends Table.TableContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds),
            betsRepository: asValue(bets),
            tempBetsRepository: asValue(tmpBets),
            resultsRepository: asValue(results),
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
}
