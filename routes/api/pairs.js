const express = require('express');
const router = express.Router();
const Pair = require('../../models/Pair');
const { check, validationResult } = require('express-validator');
const web3 = require('@solana/web3.js');
const Metadata = require("@metaplex-foundation/mpl-token-metadata");
const crypto = require('crypto');
const axios = require("axios")

const solana = new web3.Connection("https://docs-demo.solana-mainnet.quiknode.pro/");

router.post("/rr", async(req, res) => {

  let base58publicKey = new web3.PublicKey(
    "5xot9PVkphiX2adznghwrAuxGs2zeWisNSxMW6hU6Hkj",
  );
    // let rr = await Metadata.fetchMetadata(solana, base58publicKey)
  
  // Find Program address given a PublicKey
  let validProgramAddress = await web3.PublicKey.findProgramAddress(

    [Buffer.from("", "utf8")],
    base58publicKey
  );
  console.log(`Valid Program Address: ${validProgramAddress}`);
  // console.log(Metadata)
  let rr = Metadata.fetchMetadata(solana, base58publicKey);
  console.log(rr)

});

router.post("/rrr", async(req, res) => {
  console.log("start-------------------------");

  const response = await axios.get('https://api.raydium.io/v2/sdk/liquidity/mainnet.json');
  const { official, unOfficial } = response.data;
  const data = [...official, ...unOfficial];

  data.map(item => {
    Pair.findOneAndUpdate({ id: item.id }, { liquidityData: item }).then(res => {
      console.log(item.id, "--update")
    })
  })
  // try {
  //   const response = await axios.get('https://api.raydium.io/v2/sdk/liquidity/mainnet.json');
  //   const { official, unOfficial } = response.data;
  //   const data = [...official, ...unOfficial];

  //   console.log(data.length)
  //   let count = 0;

  //   for (let i = 0; i < data.length; i++) {
  //     const element = data[i];
  //     Pair.findOne({id:element.id}).then(pair => {
  //       if(!pair) {
  //         count ++;
  //         // if ( count > 200 ) break
  //         axios.get(`https://api.dexscreener.com/latest/dex/pairs/solana/${element.id}`).then(async({data}) => {
  //           let resp = { id: element.id, created: 0 }
  //           if ( data.pairs ) {
  //             resp = {id: data.pairs[0].pairAddress, created: data.pairs[0].pairCreatedAt};
  //           }
  //           new Pair(resp).save();
  //           console.log(i, resp);
  //         })
  //       }
  //     })
  //   }

  // } catch ( err) {
  //   console.log(err);
  // }
})

router.post(
  '/',
  // check('liquidity_min', 'liquidity_min is required').notEmpty(),
  // check('liquidity_max', 'liquidity_max is required').notEmpty(),
  // check('fdv_min', 'fdv_min is required').notEmpty(),
  // check('fdv_max', 'fdv_max is required').notEmpty(),
  check('pairCreatedAt_min', 'pairCreatedAt_min is required').notEmpty(),
  check('pairCreatedAt_max', 'pairCreatedAt_max is required').notEmpty(),
  // check('tokensInLP_min', 'tokensInLP_min is required').notEmpty(),
  // check('tokensInLP_max', 'tokensInLP_max is required').notEmpty(),
  // check('limitPrice_min', 'limitPrice_min is required').notEmpty(),
  // check('limitPrice_max', 'limitPrice_max is required').notEmpty(),
  // check('top5_max', 'top5_max is required').notEmpty(),
  // check('top5_min', 'top5_min is required').notEmpty(),
  // check('top10_max', 'top10_max is required').notEmpty(),
  // check('top10_min', 'top10_min is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let { pairCreatedAt_min, pairCreatedAt_max } = req.body;

    console.log(pairCreatedAt_max, pairCreatedAt_min);
    
    try {
      const timeStamp = new Date().getTime();
      pairCreatedAt_min = timeStamp - pairCreatedAt_min*3600*1000;
      pairCreatedAt_max = timeStamp - pairCreatedAt_max*3600*1000;
      console.log({ pairCreatedAt_max, pairCreatedAt_min, cur: new Date(timeStamp)});
      const data = await Pair.find({ created: { $lte: pairCreatedAt_min, $gte: pairCreatedAt_max } });
      // const count = await Pair.find({ created: { $lte: pairCreatedAt_min, $gte: pairCreatedAt_max } }).count();
      res.json(data);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


module.exports = router;
