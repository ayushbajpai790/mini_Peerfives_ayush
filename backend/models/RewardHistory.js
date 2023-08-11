class RewardHistory {
  constructor(id,Datetime, Amount, GivenByUserID) {
    this.Id=id
    this.Datetime = Datetime;
    this.Amount = Amount;
    this.GivenByUserID = GivenByUserID;
  }
}

module.exports = RewardHistory;
