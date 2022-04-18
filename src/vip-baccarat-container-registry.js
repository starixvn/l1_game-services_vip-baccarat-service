import awilix from "awilix";
import { Table } from "sc-game-base";
import { SettleGameRoundConsumer, RoundResultConsumer, PlaceBetConsumer } from "./consumers";
import { bets, rounds, tmpBets, results } from "./models/index";
import { Bot } from "./crons/index";

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
            bot: asClass(Bot).singleton(),
        });
    }
}
