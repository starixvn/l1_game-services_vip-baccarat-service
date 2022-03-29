import { RoundResultConsumer as BaseRoundResultConsumer } from "sc-game-base/src/core/event-consumers";
import { BaccaratGame, resultHelper } from "../helpers";

export default class RoundResultConsumer extends BaseRoundResultConsumer {
    generateResult() {
        const { roundId } = this.gameData;
        const resultFromAdmin = this.gameData.settlementResultFromAdmin;

        if (roundId === resultFromAdmin.roundId) {
            const cards = resultHelper.getCards();
            const baccaratGame = new BaccaratGame(cards);
            baccaratGame.setResult(resultFromAdmin.result);

            let action = "";

            do {
                action = baccaratGame.getAction();
                baccaratGame[action]();
            } while (action !== BaccaratGame.Actions.finalComparison);

            return { player: baccaratGame.player, banker: baccaratGame.banker };
        } else {
            return this.definition.generateResult();
        }
    }
}
