import { Table } from "sc-game-base";

import appConfigs from "./app-configs";
import { SettleGameRoundConsumer } from "./consumers";
import { Bot } from "./crons";
import gameSettings from "./game-settings";
import { resultHelper } from "./helpers";
import * as models from "./models";

const run = async () => {
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);

    const definition = new Table.TableGameDefinition(
        gameSettings,
        resultHelper.generateResult,
        resultHelper.getSettlementResult,
        models.rounds,
        models.bets,
        models.tmpBets,
        null
    );

    const gameCron = new Table.TableGameCron(
        definition,
        gameData,
        new Bot(definition, gameData),
        new SettleGameRoundConsumer(definition, gameData)
    );
    const startup = new Table.TableGameStartup(appConfigs, definition, gameData, gameCron);
    const app = new Table.TableGameApp(appConfigs, definition, gameData, startup);

    await app.run();
};

run();
