import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";

describe("result statistic: 100,000 times", () => {
    // arrange
    const total = 100_000;
    for (let index = 0; index < 3; index++) {
        it(`should generate results statistically correct with mode ${index + 1}`, () => {
            // arrange
            const statisticResult = {
                player: 0,
                banker: 0,
                tie: 0,
                big: 0,
                small: 0,
                dragonTails: {},
            };
            let continuity = 0;
            let isPlayerWin = false;

            // act
            for (let i = 0; i < total; i++) {
                const settlementResult = getSettlementResult(generateResult(index + 1));
                statisticResult.player += +settlementResult.player;
                statisticResult.banker += +settlementResult.banker;
                statisticResult.tie += +settlementResult.tie;
                statisticResult.big += +settlementResult.big;
                statisticResult.small += +settlementResult.small;
                if (i > 0 && !settlementResult.tie) {
                    if (settlementResult.player && isPlayerWin) {
                        continuity++;
                    } else {
                        if (settlementResult.banker && !isPlayerWin) {
                            continuity++;
                        } else {
                            if (continuity >= 4) {
                                statisticResult.dragonTails[continuity] = statisticResult.dragonTails[continuity] ?? 0;
                                statisticResult.dragonTails[continuity] += 1;
                            }
                            continuity = 0;
                        }
                    }
                }
                isPlayerWin = settlementResult.player ? true : false;
            }

            // assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statisticResult[key] / total) * 100).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${index + 1}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            expect(resultPercentage.player).toBeGreaterThanOrEqual(44);
            expect(resultPercentage.banker).toBeGreaterThanOrEqual(44);
            expect(resultPercentage.tie).toBeLessThanOrEqual(10);
            expect(statisticResult.dragonTails[4]).toBeLessThan(1500);
            expect(statisticResult.dragonTails[5]).toBeLessThan(800);
            expect(statisticResult.dragonTails[6]).toBeLessThan(450);
            expect(statisticResult.dragonTails[7]).toBeLessThan(230);
            expect(statisticResult.dragonTails[8]).toBeLessThan(130);
            expect(statisticResult.dragonTails[9]).toBeLessThan(70);
            expect(statisticResult.dragonTails[10]).toBeLessThan(35);
            expect(statisticResult.dragonTails[11]).toBeLessThan(20);
        });
    }
});
