import { Core, Table } from "sc-game-base";
import { initAPIStub } from "sc-game-service-integration-utils";

import appConfigs from "../../../src/app-configs.IGT";
import BaccaratContainerRegistry from "../../../src/vip-baccarat-container-registry";
import gameSettings from "../../../src/game-settings";
import { resultHelper } from "../../../src/helpers";

export const run = async () => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    const definition = new Table.TableGameDefinition(
        gameSettings,
        resultHelper.generateResult,
        resultHelper.getSettlementResult,
        resultHelper.generateRawResultForHash
    );
    const gameData = new Table.TableGameData(gameSettings.durations.wholeRound);

    const container = new BaccaratContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp("VipBaccarat", appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
