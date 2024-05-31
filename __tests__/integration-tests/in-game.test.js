import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";
import gameSettings from "../../src/game-settings";

export const ingameTest = () => {
    let driver;

    describe("when user joins game", () => {
        beforeAll(async () => {
            driver = new GameClientDriver(socketOptions, initUserSession(normalUser));
            await driver.handleSignedInEvent();
            driver.sendInGameEvent();
            await driver.handleGameEvent((inGameData) => inGameData.remainingTime);
        });

        afterAll(() => {
            driver.close();
        });

        const getTimeOutToPlacingBetTime = (remainingTime, durations) => {
            let timeout = 0;
            if (remainingTime <= durations.lockingBet) {
                timeout = durations.wholeRound - durations.placingBets + remainingTime + 1;
            } else if (remainingTime > durations.placingBets) {
                timeout = durations.wholeRound - durations.placingBets + 1;
            }

            return timeout;
        };

        const getTimeOutToSettleTime = (remainingTime, durations) => {
            let timeout = 0;
            if (remainingTime <= durations.placingBets) {
                timeout = remainingTime + 2;
            }

            return timeout;
        };

        it("should return game configs", async () => {
            // Arrange
            driver.sendInGameEvent();

            // Act
            const result = await driver.handleGameEvent((inGameData) => inGameData.gameConfigs);
            const { gameConfigs } = result;

            // Assert
            expect(gameConfigs.minBet).toEqual(1);
            expect(gameConfigs.maxBet).toEqual(3000);
            expect(gameConfigs.maxBetPerChoices).toStrictEqual({
                player: 3000,
                banker: 3000,
                big: 3000,
                small: 3000,
                tie: 1000,
                playerPair: 1000,
                bankerPair: 3000,
            });
            expect(gameConfigs.odds).toStrictEqual({
                player: 2,
                banker: 1.96,
                big: 1.54,
                small: 2.4,
                tie: 8,
                playerPair: 11,
                bankerPair: 11,
            });
        });

        it("should return user info", async () => {
            // Arrange
            driver.sendInGameEvent();

            // Act
            const result = await driver.handleGameEvent((inGameData) => inGameData.user);
            const { user } = result;

            // Assert

            expect(user).toStrictEqual({
                UID: 1,
                avatarId: 1,
                currency: "$US",
                name: "NormalUser",
                rate: 1,
                red: 25000,
                type: false,
            });
        });

        it("should return round history", async () => {
            // Arrange
            driver.sendInGameEvent();

            // Act
            const result = await driver.handleGameEvent((inGameData) => inGameData.roundHistory);
            const { roundHistory } = result;

            // Assert
            expect(roundHistory.length).toBeGreaterThan(0);
        });

        describe("when join game in placing bet time", () => {
            it("should return resultHash with hashValue", async () => {
                // Arrange
                driver.sendInGameEvent();

                // Act
                const { remainingTime } = await driver.handleGameEvent((inGameData) => inGameData.remainingTime);
                const timeout = getTimeOutToPlacingBetTime(remainingTime, gameSettings.durations) * 1000;
                setTimeout(() => {
                    driver.sendInGameEvent();
                }, timeout);
                const result = await driver.handleGameEvent((inGameData) => inGameData.resultHash);

                // Assert
                expect(result.resultHash.hashValue).not.toBeEmpty();
            });
        });

        describe("when join game in settle time", () => {
            it("should return resultHash with rawValue", async () => {
                // Arrange
                driver.sendInGameEvent();

                // Act
                const { remainingTime } = await driver.handleGameEvent((inGameData) => inGameData.remainingTime);
                const timeout = getTimeOutToSettleTime(remainingTime, gameSettings.durations) * 1000;
                setTimeout(() => {
                    driver.sendInGameEvent();
                }, timeout);

                const result = await driver.handleGameEvent((inGameData) => inGameData.resultHash);

                // Assert
                expect(result.resultHash.rawValue).not.toBeEmpty();
            });
        });
    });
};
