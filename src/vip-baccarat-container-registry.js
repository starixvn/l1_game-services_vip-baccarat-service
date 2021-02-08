import awilix from "awilix";
import { Table } from "sc-game-base";
import SettleGameRoundConsumer from "./consumers/settle-game-round-consumer";
import { bets, rounds, tmpBets } from "./models/index";
import { Bot } from "./crons/index";

const { asClass, asValue } = awilix;

export default class VipBaccaratContainerRegistry extends Table.TableContainerRegistry {
    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds),
            betsRepository: asValue(bets),
            tempBetsRepository: asValue(tmpBets),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            settleGameRoundConsumer: asClass(SettleGameRoundConsumer).singleton().proxy(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asClass(Bot).singleton(),
        });
    }
}
