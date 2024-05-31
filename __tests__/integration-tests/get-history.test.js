import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { socketOptions } from "./stubs/test-data";
import { initUserSession } from "./init-user-session";

export const getHistoryTest = () => {
    describe("when get history", () => {
        let driver;

        beforeAll(async () => {
            driver = new GameClientDriver(socketOptions, initUserSession(normalUser));
            await driver.handleSignedInEvent();
            driver.sendInGameEvent();
            await driver.handleGameEvent((inGameData) => inGameData.remainingTime);
        });

        afterAll(() => {
            driver.close();
        });

        it("should return history", async () => {
            // Arrange
            const expectedData = [
                {
                    betwin: 0,
                    banker: 0,
                    bankerPair: 0,
                    big: 0,
                    player: 100,
                    playerPair: 0,
                    small: 0,
                    tie: 0,
                    freeBet: false,
                    phien: 1190118,
                    roundId: 1190118,
                    name: "NormalUser",
                    odds: {
                        player: 2,
                        banker: 1.96,
                        big: 1.54,
                        small: 2.4,
                        tie: 8,
                        playerPair: 11,
                        bankerPair: 11,
                    },
                    rate: 1,
                    betLogDetails: [],
                },
                {
                    banker: 100,
                    bankerPair: 0,
                    big: 50,
                    player: 0,
                    playerPair: 0,
                    small: 0,
                    tie: 0,
                    betwin: 77,
                    freeBet: false,
                    phien: 1190119,
                    roundId: 1190119,
                    name: "NormalUser",
                    odds: {
                        player: 2,
                        banker: 1.96,
                        big: 1.54,
                        small: 2.4,
                        tie: 8,
                        playerPair: 11,
                        bankerPair: 11,
                    },
                    rate: 1,
                    betLogDetails: [],
                },
            ];

            // Act
            driver.sendGetHistoryEvent();
            const result = await driver.handleGameEvent((historyData) => historyData.history);

            // Assert
            const actualBetLogs = result.history.betLogs.map((betLog) => {
                delete betLog.result;
                delete betLog.settlementResult;
                return betLog;
            });
            expect(actualBetLogs).toEqual(expectedData);
            expect(result.history.total).toBeGreaterThan(0);
            expect(result.history.page).toBe(1);
            expect(result.history.pageSize).toBe(8);
        });
    });
};
