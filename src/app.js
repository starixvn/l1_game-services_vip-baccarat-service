import { Core, Table } from "sc-game-base";

import appConfigs from "./app-configs";
import gameSettings from "./game-settings";
import { resultHelper } from "./helpers";
import VipBaccaratContainerRegistry from "./vip-baccarat-container-registry";

const run = async () => {
    const definition = new Table.TableGameDefinition(
        gameSettings,
        resultHelper.generateResult,
        resultHelper.getSettlementResult,
        resultHelper.generateRawResultForHash
    );
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);

    const container = new VipBaccaratContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("VipBaccarat", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
