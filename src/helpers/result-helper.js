import Chance from "chance";

import BaccaratGame from "./baccarat-game";
import * as BaseCard from "./card";
import { getCardValue } from "./card-helper";

const getCards = () => {
    let cards = [...BaseCard.card];
    const chance = new Chance();

    cards = chance.shuffle(cards);
    cards = chance.shuffle(cards);
    cards = chance.shuffle(cards);

    return cards;
};

const generateResult = () => {
    const cards = getCards();
    const baccaratGame = new BaccaratGame(cards);
    let action = "";

    do {
        action = baccaratGame.getAction();
        baccaratGame[action]();
    } while (action !== BaccaratGame.Actions.finalComparison);

    return { player: baccaratGame.player, banker: baccaratGame.banker };
};

const settlementRuleEntries = Object.entries({
    player: ({ player, banker }) => {
        const playerScore = getTotalScore(player);
        const bankerScore = getTotalScore(banker);
        return playerScore > bankerScore;
    },
    banker: ({ player, banker }) => {
        const playerScore = getTotalScore(player);
        const bankerScore = getTotalScore(banker);
        return playerScore < bankerScore;
    },
    tie: ({ player, banker }) => {
        const playerScore = getTotalScore(player);
        const bankerScore = getTotalScore(banker);
        return playerScore === bankerScore;
    },
    big: ({ player, banker }) => {
        const numberOfCards = getNumberOfCards(player) + getNumberOfCards(banker);
        return numberOfCards > 4;
    },
    small: ({ player, banker }) => {
        const numberOfCards = getNumberOfCards(player) + getNumberOfCards(banker);
        return numberOfCards === 4;
    },
    playerPair: ({ player, banker }) => hasPair(player),
    bankerPair: ({ player, banker }) => hasPair(banker),
    natural: ({ player, banker }) => {
        const numberOfCards = getNumberOfCards(player) + getNumberOfCards(banker);
        return numberOfCards === 4 && (getTotalScore(player) >= 8 || getTotalScore(banker) >= 8);
    },
});

const getTotalScore = (handResult) => {
    return Object.values(handResult).reduce((result, card) => {
        const cardValue = getCardValue(card);

        return (result + cardValue) % 10;
    }, 0);
};

const getNumberOfCards = (handResult) => {
    return Object.values(handResult).filter((card) => !!card).length;
};

const hasPair = (handResult) => {
    const { card1, card2 } = handResult;

    return card1.card === card2.card;
};

const getSettlementResult = (roundResult) => {
    return settlementRuleEntries.reduce((result, [choice, rule]) => {
        result[choice] = rule(roundResult);

        return result;
    }, {});
};

const generateRawResultForMd5 = (roundResult) => {
    const thirdBankerCard = roundResult.banker.card3 ? ` ${roundResult.banker.card3.card}` : "";
    const thirdPlayerCard = roundResult.player.card3 ? ` ${roundResult.player.card3.card}` : "";
    return `{${roundResult.banker.card1.card} ${roundResult.banker.card2.card}${thirdBankerCard}, ${roundResult.player.card1.card} ${roundResult.player.card2.card}${thirdPlayerCard}}`;
};

export { getCards, generateResult, getSettlementResult, generateRawResultForMd5 };
