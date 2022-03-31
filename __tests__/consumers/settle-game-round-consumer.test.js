import { stub } from "jest-micro-auto-stub";
import { Core, Table } from "sc-game-base";

import SettleGameRoundConsumer from "../../src/consumers/settle-game-round-consumer";
import { card } from "../../src/helpers/card";
import { getCards } from "../../src/helpers/result-helper";

jest.mock("../../src/helpers/result-helper.js");
describe("SettleGameRoundConsumer tests", () => {
    const definition = new Table.TableGameDefinition({ id: 1, name: "game name" });
    definition.choices = ["player", "banker", "big", "small", "tie", "playerPair", "bankerPair"];
    definition.generateResult = jest.fn();
    definition.settle = jest.fn();
    const gameData = new Table.TableGameData(0);
    const roundResultPublisher = stub(Core.BaseEventPublishers.RoundResultPublisher);
    const userBetResultPublisher = stub(Core.BaseEventPublishers.UserBetResultPublisher);
    const endGame = jest.fn();
    getCards.mockReturnValueOnce(card);

    /** @type {mongoose.Model}*/
    const roundsRepository = { find: () => {}, create: () => {} };
    /** @type {mongoose.Model}*/
    const betsRepository = { find: () => {} };

    /** @type {mongoose.Model}*/
    const tempBetsRepository = { find: () => {} };

    const consumer = new SettleGameRoundConsumer({
        definition,
        gameData,
        roundResultPublisher,
        userBetResultPublisher,
        endGame,
        roundsRepository,
        betsRepository,
        tempBetsRepository,
    });

    it("_inherit Table.EventConsumers.TableSettleGameRoundConsumer", () => {
        expect(consumer instanceof Table.EventConsumers.TableSettleGameRoundConsumer).toBeTruthy();
    });

    describe("_calculateBetResult", () => {
        it("_always_returns correct result", () => {
            const settlementResult = {
                player: false,
                banker: false,
                big: false,
                small: false,
                tie: true,
                playerPair: false,
                bankerPair: false,
                natural: false,
            };
            const result = consumer.calculateBetResult(settlementResult, { tie: 10 }, { player: 2, banker: 2, tie: 10 });

            expect(result.netWin).toEqual(90);
            expect(result.winningByChoices.tie).toEqual(100);
        });
    });

    describe("generateResult", () => {
        describe("when result in gameData is not null", () => {
            const cards = [
                { card: 0, type: 0 },
                { card: 10, type: 1 },
                { card: 8, type: 2 },
                { card: 7, type: 3 },
                { card: 7, type: 1 },
                { card: 9, type: 2 },
            ];
            beforeEach(() => {
                consumer.gameData.result = {
                    player: { card1: cards[0], card2: cards[2], card3: null },
                    banker: { card1: cards[1], card2: cards[3], card3: null },
                    cards,
                };
                consumer.definition.generateResult = jest.fn();
            });
            it("should not call generateResult from definition", () => {
                // act
                consumer.generateResult();

                // assert
                expect(definition.generateResult).not.toHaveBeenCalled();
            });
            it("should return expected", () => {
                // act
                const actual = consumer.generateResult();

                // assert
                expect(actual).toStrictEqual({
                    player: gameData.result.player,
                    banker: gameData.result.banker,
                });
            });
        });

        describe("when result in gameData is null", () => {
            const cards = [
                { card: 0, type: 0 },
                { card: 10, type: 1 },
                { card: 8, type: 2 },
                { card: 7, type: 3 },
                { card: 7, type: 1 },
                { card: 9, type: 2 },
            ];
            beforeEach(() => {
                consumer.gameData.result = null;
                consumer.definition.generateResult = jest.fn().mockReturnValueOnce({
                    player: { card1: cards[0], card2: cards[2], card3: null },
                    banker: { card1: cards[1], card2: cards[3], card3: null },
                    cards,
                });
            });
            it("should generate new result from definition", () => {
                // act
                consumer.generateResult();

                // assert
                expect(definition.generateResult).toHaveBeenCalled();
            });
            it("should return expected", () => {
                // act
                const actual = consumer.generateResult();

                // assert
                expect(actual).toStrictEqual({
                    player: { card1: cards[0], card2: cards[2], card3: null },
                    banker: { card1: cards[1], card2: cards[3], card3: null },
                });
            });
        });
    });
});
