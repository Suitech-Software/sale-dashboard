const Erc20_Token_Contract = artifacts.require("Erc20Token");

module.exports = function (deployer) {
  deployer.deploy(Erc20_Token_Contract);
};
