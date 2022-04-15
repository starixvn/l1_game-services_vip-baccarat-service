import Chance from "chance";
import { randomInt } from "crypto";
const chance = new Chance();

const random1 = (array) => {
    return chance.integer({ min: 0, max: array.length - 1 });
};

const random2 = (array) => {
    return randomInt(array.length);
};

const random = {
    2: random1,
    3: random2,
};

const shuffle1 = (array) => {
    array = chance.shuffle(array);
    array = chance.shuffle(array);
    array = chance.shuffle(array);

    return array;
};

const shuffle2 = (array, mode) => {
    for (let i = 0; i < 3; i++) {
        let lastElementIndex = array.length - 1;

        while (lastElementIndex) {
            const randomIndex = random[mode](array);
            lastElementIndex--;
            const lastElement = array[lastElementIndex];

            array[lastElementIndex] = array[randomIndex];
            array[randomIndex] = lastElement;
        }
    }
    return array;
};

export const shuffle = {
    1: (array) => shuffle1(array),
    2: (array) => shuffle2(array, 2),
    3: (array) => shuffle2(array, 3),
};
