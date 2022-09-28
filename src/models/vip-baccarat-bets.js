import mongoose from "mongoose";

const bet = {
    uid: { type: String, required: true },
    name: { type: String, required: true },

    player: { type: Number, default: 0 },
    banker: { type: Number, default: 0 },
    big: { type: Number, default: 0 },
    small: { type: Number, default: 0 },
    tie: { type: Number, default: 0 },
    playerPair: { type: Number, default: 0 },
    bankerPair: { type: Number, default: 0 },

    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    siteId: { type: String },
    freeBet: { type: Boolean, default: false },

    playerId: { type: Number },
    operatorId: { type: String, required: false },
    roundId: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
};

const bets = mongoose.model(
    "VipBaccarat_cuoc",
    new mongoose.Schema({
        ...bet,
        currency: { type: String, required: true },
        rate: { type: Number, required: true },
        operatorId: { type: String, required: true },
    })
);
const tmpBets = mongoose.model("VipBaccarat_tmpcuoc", new mongoose.Schema(bet));

export { bets, tmpBets };
