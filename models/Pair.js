const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const liquiditySchema = new Schema({ 
  "id": String,
  "baseMint": String,
  "quoteMint": String,
  "lpMint": String,
  "baseDecimals": Number,
  "quoteDecimals": Number,
  "lpDecimals": Number,
  "version": Number,
  "programId": String,
  "authority": String,
  "openOrders": String,
  "targetOrders": String,
  "baseVault": String,
  "quoteVault": String,
  "withdrawQueue": String,
  "lpVault": String,
  "marketVersion": Number,
  "marketProgramId": String,
  "marketId": String,
  "marketAuthority": String,
  "marketBaseVault": String,
  "marketQuoteVault": String,
  "marketBids": String,
  "marketAsks": String,
  "marketEventQueue": String,
  "lookupTableAccount": String,
});

const PairSchema = new Schema(
  {
    "id": { type: String, required: true, unique : true },
    "created": { type: Number, required: true },
    "liquidityData": liquiditySchema
  },
  { timestamps: true }
);

module.exports = mongoose.model('pair', PairSchema);
