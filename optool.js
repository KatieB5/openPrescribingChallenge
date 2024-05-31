import { argv, env } from "node:process";

async function main(chemicalCode) {
  const chemicalData = await getChemicalName(chemicalCode);
  console.log(chemicalData.name);
  chemicalData.spendingData.forEach((datum) => {
    console.log(datum);
  });
}

async function getChemicalName(chemicalCode) {
  if (chemicalCode.length !== 9) {
    throw new Error("Code is not valid: must be 9 character chemical code");
  }

  const baseUrl = `https://openprescribing.net/api/1.0/`;
  const responseChemName = await fetch(
    baseUrl + `bnf_code?format=json&exact=true&q=${chemicalCode}`
  );
  const responseSpendByOrg = await fetch(
    baseUrl + `spending_by_org/?org_type=icb&code=${chemicalCode}&format=json`
  );

  if (!responseChemName.ok) {
    throw new Error(`HTTP error: ${responseChemName.status}`);
  } else if (!responseSpendByOrg.ok) {
    throw new Error(`HTTP error: ${responseSpendByOrg.status}`);
  }

  const resultsChemName = await responseChemName.json();
  const resultChemName = resultsChemName[0];
  const resultsSpendByOrg = await responseSpendByOrg.json();

  if (!resultChemName || resultsSpendByOrg.length === 0) {
    throw new Error("Code is not valid: not found");
  }

  resultsSpendByOrg.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return b.items - a.items;
  });

  const uniqueDates = new Set();
  const highestItemsbyDate = resultsSpendByOrg.filter((resultObj) => {
    if (!uniqueDates.has(resultObj.date)) {
      uniqueDates.add(resultObj.date);
      return resultsSpendByOrg;
    }
  });

  const dateIcbItems = highestItemsbyDate.map((resultObj) => {
    return `${resultObj["date"]} ${resultObj["row_name"]} ${resultObj["items"]}`;
  });

  return { name: resultChemName["name"], spendingData: dateIcbItems };
}

if (env?.NODE_ENV !== "test") {
  const chemicalCode = argv.slice(2)[0];
  main(chemicalCode);
}

export { getChemicalName };
