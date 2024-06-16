import assert from "node:assert";
import { mock, test } from "node:test";
import { getChemicalName } from "./optool.js";

/**
 * Define fake responses for HTTP requests
 *
 * @param url - the URL to be requested
 * @param response - the JSON to return as a response
 */

let useMocks = false;

function mockFetch(url, response) {
  if (useMocks === true) {
    fetch = mock.fn((input) => {
      return {
        ok: true,
        json: () => (input == url ? response : {}),
      };
    });
  }
}

test.skip("should get the chemical name", async () => {
  let useMocks = true;
  mockFetch(
    "https://openprescribing.net/api/1.0/bnf_code?format=json&exact=true&q=0407010AD",
    [
      {
        type: "chemical",
        id: "0407010AD",
        name: "Paracetamol and ibuprofen",
        section: "4.7: Analgesics",
      },
    ]
  );

  const chemicalName = await getChemicalName("0407010AD");
  assert.strictEqual(chemicalName, "Paracetamol and ibuprofen");
});

test.skip("should not allow full BNF code", async () => {
  let useMocks = false;
  await assert.rejects(async () => await getChemicalName("0407010ADAAABAB"), {
    name: "Error",
    message: "Code is not valid: must be 9 character chemical code",
  });
});

test.skip("should check for a valid BNF code", async () => {
  let useMocks = true;
  mockFetch(
    "https://openprescribing.net/api/1.0/bnf_code?format=json&exact=true&q=0000000AA",
    []
  );

  await assert.rejects(async () => await getChemicalName("0000000AA"), {
    name: "Error",
    message: "Code is not valid: not found",
  });
});

test.skip("should get the spending data for the chemical for all ICBs", async () => {
  let useMocks = true;
  mockFetch(
    "https://openprescribing.net/api/1.0/spending_by_org/?org_type=icb&code=0301020I0&format=json",
    [
      {
        items: 1672,
        quantity: 14448.0,
        actual_cost: 8518.15,
        date: "2019-04-01",
        row_id: "QF7",
        row_name: "NHS LANCASHIRE AND SOUTH CUMBRIA INTEGRATED CARE BOARD",
      },
      {
        items: 1158,
        quantity: 14448.0,
        actual_cost: 8518.15,
        date: "2019-04-01",
        row_id: "QF7",
        row_name: "NHS SOUTH YORKSHIRE INTEGRATED CARE BOARD",
      },
      {
        items: 423,
        quantity: 6470.0,
        actual_cost: 3195.77,
        date: "2019-04-01",
        row_id: "QGH",
        row_name: "NHS HEREFORDSHIRE AND WORCESTERSHIRE INTEGRATED CARE BOARD",
      },
    ]
  );

  const spendingData = await getSpendingData("0301020I0");
  assert.strictEqual(
    spendingData[0],
    "2019-04-01 NHS LANCASHIRE AND SOUTH CUMBRIA INTEGRATED CARE BOARD 1672"
  );
});

test.skip("should get the spending data for the chemical for all ICBs", async () => {
  const spendingData = await getSpendingData("0301020I0");
  assert.strictEqual(
    spendingData[0],
    "2019-04-01 NHS LANCASHIRE AND SOUTH CUMBRIA INTEGRATED CARE BOARD 1672"
  );
});

test.skip("should not allow full BNF code", async () => {
  let useMocks = false;
  await assert.rejects(async () => await getSpendingData("0407010ADAAABAB"), {
    name: "Error",
    message: "Code is not valid: must be 9 character chemical code",
  });
});

test.skip("should check for a valid BNF code", async () => {
  let useMocks = true;
  mockFetch(
    "https://openprescribing.net/api/1.0/spending_by_org/?org_type=icb&code=0000000AA&format=json",
    []
  );

  await assert.rejects(async () => await getSpendingData("0000000AA"), {
    name: "Error",
    message: "Code is not valid: not found",
  });
});

test.skip("should check for a valid BNF code", async () => {
  let useMocks = false;
  await assert.rejects(async () => await getSpendingData("0000000AA"), {
    name: "Error",
    message: "Code is not valid: not found",
  });
});

test.skip("should get the spending data for the chemical for all ICBs", async () => {
  let useMocks = true;
  mockFetch(
    "https://openprescribing.net/api/1.0/spending_by_org/?org_type=icb&code=0301020I0&format=json",
    [
      {
        items: 1672,
        quantity: 14448.0,
        actual_cost: 8518.15,
        date: "2019-04-01",
        row_id: "QF7",
        row_name: "NHS LANCASHIRE AND SOUTH CUMBRIA INTEGRATED CARE BOARD",
      },
      {
        items: 1158,
        quantity: 14448.0,
        actual_cost: 8518.15,
        date: "2019-04-01",
        row_id: "QF7",
        row_name: "NHS SOUTH YORKSHIRE INTEGRATED CARE BOARD",
      },
      {
        items: 423,
        quantity: 6470.0,
        actual_cost: 3195.77,
        date: "2019-04-01",
        row_id: "QGH",
        row_name: "NHS HEREFORDSHIRE AND WORCESTERSHIRE INTEGRATED CARE BOARD",
      },
    ]
  );

  const spendingData = await getSpendingData("0301020I0");
  assert.strictEqual(
    spendingData[0],
    "2019-04-01 NHS GREATER MANCHESTER INTEGRATED CARE BOARD 2301"
  );
});

//new test following part 3 refactor
test.skip("should return spending data for the ICB that prescribed the chemical most frequently on each date", async () => {
  let useMocks = false;
  const spendingData = await getSpendingData("0407010AD");
  assert.strictEqual(
    spendingData[0],
    "2019-04-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 3"
  );
});

test("should get the chemical name and spending data", async () => {
  const chemicalData = await getChemicalName("0407010AD");
  assert.strictEqual(chemicalData.name, "Paracetamol and ibuprofen");
  assert.strictEqual(
    chemicalData.spendingData[0],
    "2019-04-01 NHS HUMBER AND NORTH YORKSHIRE INTEGRATED CARE BOARD 3"
  );
});

test("should not allow full BNF code", async () => {
  let useMocks = false;
  await assert.rejects(async () => await getChemicalName("0407010ADAAABAB"), {
    name: "Error",
    message: "Code is not valid: must be 9 character chemical code",
  });
});

test("should check for a valid BNF code", async () => {
  let useMocks = false;
  await assert.rejects(async () => await getChemicalName("0000000AA"), {
    name: "Error",
    message: "Code is not valid: not found",
  });
});
