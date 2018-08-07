// Script for looking at an account and deciding which bidding strategy to use.
// Looks at CTR - < 0.5%
// Looks at CPC - < $2.00
// If the campaign meets that criteria, the bidding strategy should be max clicks
// If not it should be VCPM
// Also look at the account and campaign labels - apply a iHeart_MaxClicks if the campaign requires it.
// If not remove that label.

function main() {

  // Init Variables
  var maxCpm = parseFloat(1.25);
  var maxCpc = parseFloat(2.00);
  var ctrCheck = parseFloat(.005);

  var maxClicksLabel = 'iHeart_MaxClicks';

  var currentAccount = AdWordsApp.currentAccount();
  var accountName = currentAccount.getName();
  Logger.log("Account - " + accountName);

  var labelSelector = AdWordsApp.labels();

  var labelIterator = labelSelector.get();

  while (labelIterator.hasNext()) {
    var label = labelIterator.next();
    var labelName = label.getName();
    Logger.log("Account Label - " + labelName);
  }
  

  var campaignSelector = AdWordsApp
    .campaigns()
    .withCondition("Status = ENABLED");

  var campaignIterator = campaignSelector.get();

  while(campaignIterator.hasNext()) {
    var campaign = campaignIterator.next();
    var campaignName = campaign.getName();

    var biddingStrategy = campaign.getBiddingStrategyType();

    var currentBudget = campaign.getBudget();

    Logger.log("Campaign Name - " + campaignName + " Bidding Strategy - " + biddingStrategy + " Campaign Budget - " + currentBudget);
    var stats = campaign.getStatsFor("ALL_TIME");

    var cpc = stats.getAverageCpc();
    var cpm = stats.getAverageCpm();
    var ctr = stats.getCtr();

    Logger.log("Campaign Stats - " + " cpc: " + cpc + " cpm: " + cpm + " ctr: " + ctr);

  }

  if(cpc <= maxCpc && ctr <= ctrCheck) {
    Logger.log("Current Cost per Click is below Target of $2.00 - Recommended Bidding Strategy is Max Clicks");
    // campaign.bidding().setStrategy("TARGET_SPEND");
    // Apply Account Label - iHeart_MaxClicks
    // account.applyLabel(maxClicksLabel);
  }
  else if(cpm >= maxCpm) {
      Logger.log("Cpm is above $5 - Recommended bidding strategy is VCPM");
      // campaign.bidding().setStrategy("MANUAL_CPM");
      // account.removeLabel(maxClicksLabel);
    }
  else {
      Logger.log("Campaign stats are holding, no adjustment necessary");
    }
}