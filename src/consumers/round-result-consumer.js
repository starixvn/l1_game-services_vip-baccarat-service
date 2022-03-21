import { generateMD5Result } from "sc-game-base/src/core/helpers/md5-helper";
import { encrypt, decrypt } from "sc-game-base/src/core/helpers/crypto-helper";
import { BaccaratGame, resultHelper } from "../helpers";

export default class RoundResultConsumer {
    constructor(gameData, definition, roundResultPublisher, md5sRepository) {
        this.gameData = gameData;
        this.definition = definition;
        this.roundResultPublisher = roundResultPublisher;
        this.md5sRepository = md5sRepository;
    }

    async generateResultAndPublishMD5(lastMD5Record) {
        if (!this.md5sRepository) {
            return;
        }

        if (lastMD5Record && lastMD5Record.roundId === this.gameData.roundId) {
            this.gameData.result = JSON.parse(decrypt(lastMD5Record.encryptedResult));
            this.gameData.md5 = JSON.parse(decrypt(lastMD5Record.encryptedMD5));
        } else {
            const { roundId } = this.gameData;
            const result = this.generateResult();
            const formattedResult = this.definition.generateRawResultForMd5(result);
            this.gameData.md5 = { ...generateMD5Result(formattedResult, roundId), roundId };
            this.gameData.result = result;

            await this.md5sRepository.create({
                roundId: roundId,
                encryptedMD5: encrypt(JSON.stringify(this.gameData.md5)),
                encryptedResult: encrypt(JSON.stringify(result)),
                time: new Date(),
            });
        }

        this.roundResultPublisher.publishMD5();
    }

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
