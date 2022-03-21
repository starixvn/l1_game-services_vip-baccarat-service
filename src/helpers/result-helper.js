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
    let rawResult = "{";
    rawResult +=
        Object.values(roundResult.player)
            .filter((card) => card)
            .map((card) => BaseCard.name[card.card])
            .join(" ") + ",";
    rawResult +=
        Object.values(roundResult.banker)
            .filter((card) => card)
            .map((card) => BaseCard.name[card.card])
            .join(" ") + "}";
    return rawResult;
};

export { getCards, generateResult, getSettlementResult, generateRawResultForMd5 };
