// Define the proposed trade. ------------------------------------------------
  // Technically you don't need to specify the amounts (in the "value" field)
  // to look up order books using book_offers, but for this tutorial we reuse
  // these variables to construct the actual Offer later.
  const we_want = {
    currency: "TST",
    issuer: "rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd",
    value: "25"
  }
  const we_spend = {
    currency: "XRP",
           // 25 TST * 10 XRP per TST * 15% financial exchange (FX) cost
    value: xrpl.xrpToDrops(25*10*1.15)
  }
  // "Quality" is defined as TakerPays / TakerGets. The lower the "quality"
  // number, the better the proposed exchange rate is for the taker.
  // The quality is rounded to a number of significant digits based on the
  // issuer's TickSize value (or the lesser of the two for token-token trades.)
  const proposed_quality = BigNumber(we_spend.value) / BigNumber(we_want.value)


    // If part of the Offer was expected to cross, then the rest would be placed
    // at the top of the order book. If none did, then there might be other
    // Offers going the same direction as ours already on the books with an
    // equal or better rate. This code counts how much liquidity is likely to be
    // above ours.

    // Unlike above, this time we check for Offers going the same direction as
    // ours, so TakerGets and TakerPays are reversed from the previous
    // book_offers request.
    const orderbook2_resp = await client.request({
      "command": "book_offers",
      "taker": wallet.address,
      "ledger_index": "current",
      "taker_gets": we_spend,
      "taker_pays": we_want
    })
    console.log(JSON.stringify(orderbook2_resp.result, null, 2))

    // Since TakerGets/TakerPays are reversed, the quality is the inverse.
    // You could also calculate this as 1/proposed_quality.
    const offered_quality = BigNumber(we_want.value) / BigNumber(we_spend.value)

    const offers2 = orderbook2_resp.result.offers
    let tally_currency = we_spend.currency
    if (tally_currency == "XRP") { tally_currency = "drops of XRP" }
    let running_total2 = 0
    if (!offers2) {
      console.log(`No similar Offers in the book. Ours would be the first.`)
    } else {
      for (const o of offers2) {
        if (o.quality <= offered_quality) {
          console.log(`Existing offer found, funded with
                ${o.owner_funds} ${tally_currency}`)
          running_total2 = running_total2.plus(BigNumber(o.owner_funds))
        } else {
          console.log(`Remaining orders are below where ours would be placed.`)
          break
        }
      }
      console.log(`Our Offer would be placed below at least
            ${running_total2} ${tally_currency}`)
      if (running_total > 0 && running_total < want_amt) {
        console.log(`Remaining ${want_amt - running_total} ${tally_currency}
              will probably be placed on top of the order book.`)
      }
    }
