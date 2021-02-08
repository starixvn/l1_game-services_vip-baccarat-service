import { Core, Table } from "sc-game-base";

import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { resultHelper } from "./helpers";
import * as models from "./models";
import VipBaccaratContainerRegistry from "./vip-baccarat-container-registry";

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

    const container = new VipBaccaratContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(container);

    await app.run();
};

run();
