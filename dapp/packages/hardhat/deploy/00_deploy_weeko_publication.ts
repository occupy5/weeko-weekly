import { deployScript, artifacts } from "../rocketh/deploy.js";

const DEFAULT_MINT_PRICE_WEI = 0n;

export default deployScript(
  async env => {
    const { deployer } = env.namedAccounts;

    const weekoPublication = await env.deploy("WeekoPublication", {
      account: deployer,
      artifact: artifacts.WeekoPublication,
      args: [deployer, DEFAULT_MINT_PRICE_WEI],
    });

    const mintPrice = await env.read(weekoPublication, { functionName: "mintPrice" });
    console.log("WeekoPublication deployed with mint price:", mintPrice.toString());
  },
  {
    tags: ["WeekoPublication"],
  },
);
