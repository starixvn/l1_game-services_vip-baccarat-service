import Chance from "chance";

import BaccaratGame from "./baccarat-game";
import * as BaseCard from "./card";

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

    const result = { player: baccaratGame.player, banker: baccaratGame.banker };

    return result;
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

const getCardValue = (card) => {
    if (card == null) {
        return 0;
    }

    let cardValue = card.card + 1;

    if (cardValue >= 10) {
        // Card 10, J, Q, K
        cardValue = 0;
    }

    return cardValue;
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

export { getCards, generateResult, getSettlementResult };
