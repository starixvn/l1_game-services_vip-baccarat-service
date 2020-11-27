import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment-reworked";

const modelName = "VipBaccarat_phien";

const card = {
    card: Number,
    type: Number,
};

const hand = {
    card1: card,
    card2: card,
    card3: card,
};

const resultSchema = new mongoose.Schema(
    {
        player: { type: hand },
        banker: { type: hand },
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        player: { type: Boolean, default: false },
        banker: { type: Boolean, default: false },
        big: { type: Boolean, default: false },
        small: { type: Boolean, default: false },
        tie: { type: Boolean, default: false },
        playerPair: { type: Boolean, default: false },
        bankerPair: { type: Boolean, default: false },
        natural: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
});

Schema.plugin(autoIncrement.MongooseAutoIncrementID.plugin, { modelName, field: "id" });

export default mongoose.model(modelName, Schema);
