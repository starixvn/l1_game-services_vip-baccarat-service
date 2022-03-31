import { RoundResultConsumer } from "../../src/consumers";
import { RoundResultConsumer as BaseRoundResultConsumer } from "sc-game-base/src/core/event-consumers";
import BaccaratPlayer from "../../src/helpers/baccarat-player";

describe("RoundResultConsumer test", () => {
    it("inherit  BaseRoundResultConsumer", () => {
        // act
        const consumer = new RoundResultConsumer();

        // assert
        expect(consumer instanceof BaseRoundResultConsumer);
    });

    describe("generateResult", () => {
        describe("when set result from admin", () => {
            // arrange
            const gameData = {
                roundId: 2,
                settlementResultFromAdmin: {
                    roundId: 2,
                    result: {
                        player: [
                            { card: 11, type: 2 },
                            { card: 3, type: 0 },
                            { card: 6, type: 1 },
                        ],
                        banker: [
                            { card: 5, type: 1 },
                            { card: 9, type: 2 },
                            { card: 3, type: 2 },
                        ],
                    },
                },
            };
            it("should return result from admin", () => {
                // arrange
                const consumer = new RoundResultConsumer(gameData);
                const player = new BaccaratPlayer();
                player.setCards(gameData.settlementResultFromAdmin.result.player);
                const banker = new BaccaratPlayer();
                banker.setCards(gameData.settlementResultFromAdmin.result.banker);

                // act
                const actual = consumer.generateResult();

                // assert
                expect(actual).toStrictEqual({ player, banker });
            });

            it("should not call generateResult from definition", () => {
                // arrange
                const definition = { generateResult: jest.fn().mockReturnValue({ player: {}, banker: {} }) };
                const consumer = new RoundResultConsumer(gameData, definition);

                // act
                consumer.generateResult();

                // assert
                expect(definition.generateResult).not.toHaveBeenCalled();
            });
        });

        describe("when settlement result from admin is empty", () => {
            it("should call generateResult from definition", () => {
                // arrange
                const definition = { generateResult: jest.fn().mockReturnValue({ player: {}, banker: {} }) };
                const gameData = { roundId: 2, settlementResultFromAdmin: {} };
                const consumer = new RoundResultConsumer(gameData, definition);

                // act
                const actual = consumer.generateResult();

                // assert
                expect(actual).toStrictEqual({ player: {}, banker: {} });
            });
        });
    });
});
