import { RoundResultConsumer as BaseRoundResultConsumer } from "sc-game-base/src/core/event-consumers";
import { BaccaratGame, resultHelper } from "../helpers";

export default class RoundResultConsumer extends BaseRoundResultConsumer {
    generateResult() {
        const { roundId } = this.gameData;
        const resultFromAdmin = this.gameData.settlementResultFromAdmin;

        if (roundId === resultFromAdmin.roundId) {
            const tmpCards = resultHelper.getCards();
            const baccaratGame = new BaccaratGame([...tmpCards]);
            baccaratGame.setResult(resultFromAdmin.result);

            let action = "";

            do {
                action = baccaratGame.getAction();
                baccaratGame[action]();
            } while (action !== BaccaratGame.Actions.finalComparison);

            const cards = [];
            [1, 2, 3].forEach((index) => {
                cards.push(baccaratGame.player[`card${index}`] || tmpCards.shift());
                cards.push(baccaratGame.banker[`card${index}`] || tmpCards.shift());
            });

            return { player: baccaratGame.player, banker: baccaratGame.banker, cards };
        } else {
            return this.definition.generateResult();
        }
    }
}
