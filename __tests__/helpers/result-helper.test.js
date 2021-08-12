import { getSettlementResult } from "../../src/helpers/result-helper";

describe("Get the settlement result", () => {
    it("should player win when total score of player greater than banker", () => {
        // arrange
        const roundResult = {
            player: { card1: { card: 10, type: 2 }, card2: { card: 7, type: 0 } },
            banker: { card1: { card: 2, type: 2 }, card2: { card: 3, type: 0 } },
        };

        // act
        const expectedResult = getSettlementResult(roundResult);

        // assert
        expect(expectedResult.player).toBeTruthy();
    });

    it("should banker win when total score of banker greater than player", () => {
        // arrange
        const roundResult = {
            banker: { card1: { card: 10, type: 2 }, card2: { card: 7, type: 0 } },
            player: { card1: { card: 2, type: 2 }, card2: { card: 3, type: 0 } },
        };

        // act
        const expectedResult = getSettlementResult(roundResult);

        // assert
        expect(expectedResult.banker).toBeTruthy();
    });

    it("should tie when total score of banker equal player", () => {
        // arrange
        const roundResult = {
            banker: { card1: { card: 10, type: 2 }, card2: { card: 7, type: 0 } },
            player: { card1: { card: 10, type: 2 }, card2: { card: 7, type: 0 } },
        };

        // act
        const expectedResult = getSettlementResult(roundResult);

        // assert
        expect(expectedResult.tie).toBeTruthy();
    });

    it("should big win when total cards greater than 4", () => {
        // arrange
        const roundResult = {
            banker: { card1: { card: 10, type: 2 }, card2: { card: 7, type: 0 }, card3: { card: 7, type: 0 } },
            player: { card1: { card: 10, type: 2 }, card2: { card: 7, type: 0 } },
        };

        // act
        const expectedResult = getSettlementResult(roundResult);

        // assert
        expect(expectedResult.big).toBeTruthy();
    });

    it("should small win when total cards equal 4", () => {
        // arrange
        const roundResult = {
            banker: { card1: { card: 10, type: 2 }, card2: { card: 7, type: 0 } },
            player: { card1: { card: 10, type: 2 }, card2: { card: 7, type: 0 } },
        };

        // act
        const expectedResult = getSettlementResult(roundResult);

        // assert
        expect(expectedResult.small).toBeTruthy();
    });

    it("player pair", () => {
        // arrange
        const roundResult = {
            player: { card1: { card: 10, type: 2 }, card2: { card: 10, type: 0 } },
            banker: { card1: { card: 10, type: 2 }, card2: { card: 7, type: 0 } },
        };

        // act
        const expectedResult = getSettlementResult(roundResult);

        // assert
        expect(expectedResult.playerPair).toBeTruthy();
    });

    it("banker pair", () => {
        // arrange
        const roundResult = {
            player: { card1: { card: 10, type: 2 }, card2: { card: 3, type: 0 } },
            banker: { card1: { card: 7, type: 2 }, card2: { card: 7, type: 0 } },
        };

        // act
        const expectedResult = getSettlementResult(roundResult);

        // assert
        expect(expectedResult.bankerPair).toBeTruthy();
    });
});
