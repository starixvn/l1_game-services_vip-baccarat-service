import mongoose from "mongoose";

const schema = new mongoose.Schema({
    uid: { type: String, required: true },
    name: { type: String, required: true },
    phien: { type: Number, required: true },

    player: { type: Number, default: 0 },
    banker: { type: Number, default: 0 },
    big: { type: Number, default: 0 },
    small: { type: Number, default: 0 },
    tie: { type: Number, default: 0 },
    playerPair: { type: Number, default: 0 },
    bankerPair: { type: Number, default: 0 },

    thanhtoan: { type: Boolean, default: false },
    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    memberId: { type: Number },
    siteId: { type: String },
    freeBet: { type: Boolean, default: false },
});

const bets = mongoose.model("VipBaccarat_cuoc", schema);
const tmpBets = mongoose.model("VipBaccarat_tmpcuoc", schema);

export { bets, tmpBets };
