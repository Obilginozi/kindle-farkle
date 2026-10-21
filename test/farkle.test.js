var assert = require("assert");
var F = require("../farkle.js");

function expectScore(dice, rules, points) {
  var scored = F.scoreDice(dice, rules);
  if (points === null) {
    assert.strictEqual(scored.valid, false, dice.join(",") + " " + rules);
    return;
  }
  assert.strictEqual(scored.valid, true, dice.join(",") + " " + rules);
  assert.strictEqual(scored.points, points, dice.join(",") + " " + rules + " -> " + scored.points);
}

var official = [
  [[1], 100],
  [[5], 50],
  [[2], null],
  [[1, 1], 200],
  [[1, 1, 1], 300],
  [[2, 2, 2], 200],
  [[3, 3, 3], 300],
  [[4, 4, 4], 400],
  [[5, 5, 5], 500],
  [[6, 6, 6], 600],
  [[1, 1, 1, 1], 1000],
  [[4, 4, 4, 4], 1000],
  [[5, 5, 5, 5, 5], 2000],
  [[6, 6, 6, 6, 6, 6], 3000],
  [[1, 1, 1, 1, 1, 1], 3000],
  [[1, 2, 3, 4, 5, 6], 1500],
  [[1, 1, 2, 2, 3, 3], 1500],
  [[6, 6, 5, 5, 4, 4], 1500],
  [[2, 2, 2, 2, 5, 5], 1500],
  [[4, 4, 4, 4, 1, 1], 1500],
  [[3, 3, 3, 3, 4, 4], 1500],
  [[1, 1, 1, 5, 5, 5], 2500],
  [[6, 6, 6, 2, 2, 2], 2500],
  [[1, 1, 1, 1, 1, 5], 2050],
  [[2, 2], null],
  [[1, 2], null],
  [[2, 3, 4, 6, 2, 3], null],
  [[], null]
];

official.forEach(function (row) {
  expectScore(row[0], "official", row[1]);
});

var classic = [
  [[1, 1, 1], 1000],
  [[1, 1, 1, 1], 2000],
  [[1, 1, 1, 1, 1], 3000],
  [[1, 1, 1, 1, 1, 1], 4000],
  [[2, 2, 2, 2], 400],
  [[5, 5, 5, 5, 5], 1500],
  [[6, 6, 6, 6, 6, 6], 2400],
  [[1, 1, 1, 1, 5, 5], 2100],
  [[2, 2, 2], 200]
];

classic.forEach(function (row) {
  expectScore(row[0], "classic", row[1]);
});

var best = F.bestSubsetIndices([1, 2, 2, 3, 4, 6], "official");
assert.deepStrictEqual(best.indices, [0]);
assert.strictEqual(best.points, 100);

best = F.bestSubsetIndices([1, 5, 2, 2, 4, 6], "official");
assert.deepStrictEqual(best.indices, [0, 1]);
assert.strictEqual(best.points, 150);

best = F.bestSubsetIndices([2, 2, 2, 2, 3, 4], "official");
assert.deepStrictEqual(best.indices, [0, 1, 2, 3]);
assert.strictEqual(best.points, 1000);

best = F.bestSubsetIndices([1, 1, 2, 2, 3, 3], "official");
assert.strictEqual(best.points, 1500);
assert.strictEqual(best.indices.length, 6);

assert.strictEqual(F.bestSubsetIndices([2, 3, 4, 6, 2, 3], "official"), null);

assert.strictEqual(F.betterPick(null, { points: 100, indices: [0] }), true);
assert.strictEqual(
  F.betterPick({ points: 100, indices: [0, 1] }, { points: 100, indices: [2] }),
  true
);
assert.strictEqual(
  F.betterPick({ points: 100, indices: [0] }, { points: 100, indices: [1, 2] }),
  false
);
assert.strictEqual(
  F.betterPick({ points: 50, indices: [0] }, { points: 100, indices: [1, 2, 3] }),
  true
);

assert.throws(function () {
  F.createGame({ names: ["  "] });
});

var solo = F.createGame({ names: ["  Ada  "], rules: "classic" });
assert.strictEqual(solo.players[0].name, "Ada");
assert.strictEqual(solo.rules, "classic");
assert.strictEqual(solo.phase, "need-roll");
assert.strictEqual(F.beginTurn(solo), false);

var multi = F.createGame({ names: ["A", "B", "C", "D", "E"] });
assert.strictEqual(multi.players.length, 4);
assert.strictEqual(multi.phase, "handoff");
assert.strictEqual(F.roll(multi, [1, 1, 1, 1, 1, 1]), false);

function farkle(state, name) {
  if (state.phase === "handoff") {
    assert.strictEqual(F.beginTurn(state), true);
  }
  assert.strictEqual(state.players[state.current].name, name);
  assert.strictEqual(F.roll(state, [2, 3, 4, 6, 2, 3]), true);
  assert.strictEqual(state.phase, "farkle");
  assert.strictEqual(state.turnPoints, 0);
  assert.strictEqual(F.acknowledgeFarkle(state), true);
}

function bankSix(state, name, dice) {
  if (state.phase === "handoff") assert.strictEqual(F.beginTurn(state), true);
  assert.strictEqual(state.players[state.current].name, name);
  assert.strictEqual(F.roll(state, dice), true);
  assert.strictEqual(F.selectBest(state), true);
  assert.strictEqual(F.bank(state), true);
}

var gate = F.createGame({ names: ["Ada"] });
assert.strictEqual(F.roll(gate, [1, 2, 3, 4, 6, 6]), true);
assert.strictEqual(F.selectBest(gate), true);
assert.strictEqual(F.bankTotal(gate), 100);
assert.strictEqual(F.canBank(gate), false);
assert.strictEqual(F.canRoll(gate), true);
var before = JSON.stringify(gate.players);
assert.strictEqual(F.bank(gate), false);
assert.strictEqual(JSON.stringify(gate.players), before);
assert.strictEqual(gate.phase, "pick");

assert.strictEqual(F.roll(gate, [5, 5, 5, 2, 3]), true);
assert.strictEqual(gate.turnPoints, 100);
assert.strictEqual(gate.roll.length, 5);
F.toggleDie(gate, 0);
F.toggleDie(gate, 1);
F.toggleDie(gate, 2);
assert.strictEqual(F.selectionInfo(gate).points, 500);
assert.strictEqual(F.bankTotal(gate), 600);
assert.strictEqual(F.canBank(gate), true);
assert.strictEqual(F.bank(gate), true);
assert.strictEqual(gate.players[0].score, 600);
assert.strictEqual(gate.players[0].onBoard, true);
assert.strictEqual(gate.phase, "need-roll");

assert.strictEqual(F.roll(gate, [5, 2, 3, 4, 6, 6]), true);
F.toggleDie(gate, 0);
assert.strictEqual(F.bankTotal(gate), 50);
assert.strictEqual(F.canBank(gate), true);
assert.strictEqual(F.bank(gate), true);
assert.strictEqual(gate.players[0].score, 650);

var split = F.createGame({ names: ["Ada"] });
assert.strictEqual(F.roll(split, [5, 2, 3, 4, 6, 6]), true);
F.toggleDie(split, 0);
assert.strictEqual(F.roll(split, [5, 5, 2, 3, 4]), true);
assert.strictEqual(split.turnPoints, 50);
F.toggleDie(split, 0);
F.toggleDie(split, 1);
assert.strictEqual(F.selectionInfo(split).points, 100);
assert.strictEqual(F.bankTotal(split), 150);

var hot = F.createGame({ names: ["Ada"] });
assert.strictEqual(F.roll(hot, [1, 2, 3, 4, 5, 6]), true);
assert.strictEqual(F.selectBest(hot), true);
assert.strictEqual(F.selectionInfo(hot).points, 1500);
assert.strictEqual(F.selectionInfo(hot).allTaken, true);
assert.strictEqual(F.canBank(hot), true);
assert.strictEqual(F.roll(hot, [1, 1, 1, 2, 2, 2]), true);
assert.strictEqual(hot.turnPoints, 1500);
assert.strictEqual(hot.roll.length, 6);
assert.strictEqual(hot.lockedCount, 6);
assert.strictEqual(hot.phase, "pick");
assert.strictEqual(F.roll(hot, [2, 3, 4, 6, 2, 3]), false);
assert.strictEqual(F.selectBest(hot), true);
assert.strictEqual(F.bank(hot), true);
assert.strictEqual(hot.players[0].score, 4000);

var bust = F.createGame({ names: ["Ada"] });
F.roll(bust, [1, 2, 3, 4, 5, 6]);
F.selectBest(bust);
F.roll(bust, [2, 3, 4, 6, 2, 3]);
assert.strictEqual(bust.phase, "farkle");
assert.strictEqual(bust.turnPoints, 0);
assert.strictEqual(F.acknowledgeFarkle(bust), true);
assert.strictEqual(bust.players[0].score, 0);
assert.strictEqual(bust.players[0].turns, 1);
assert.strictEqual(bust.phase, "need-roll");

var race = F.createGame({ names: ["Ada"] });
var wins = 0;
while (!race.over) {
  F.roll(race, [6, 6, 6, 6, 6, 6]);
  F.selectBest(race);
  F.bank(race);
  wins += 1;
  assert.ok(wins < 6);
}
assert.strictEqual(race.players[0].score, 12000);
assert.strictEqual(race.players[0].turns, 4);
assert.strictEqual(race.result.type, "win");
assert.strictEqual(F.roll(race, [1, 1, 1, 1, 1, 1]), false);

var table = F.createGame({ names: ["A", "B", "C"] });
var round;
for (round = 0; round < 3; round++) {
  bankSix(table, "A", [6, 6, 6, 6, 6, 6]);
  farkle(table, "B");
  farkle(table, "C");
}
assert.strictEqual(table.players[0].score, 9000);
assert.strictEqual(table.finalRound, false);
bankSix(table, "A", [6, 6, 6, 6, 6, 6]);
assert.strictEqual(table.players[0].score, 12000);
assert.strictEqual(table.finalRound, true);
assert.deepStrictEqual(table.pendingLast, [1, 2]);
assert.strictEqual(table.phase, "handoff");
assert.strictEqual(table.players[table.current].name, "B");
farkle(table, "B");
assert.strictEqual(table.players[table.current].name, "C");
farkle(table, "C");
assert.strictEqual(table.over, true);
assert.strictEqual(table.players[0].turns, 4);
assert.strictEqual(table.players[1].turns, 4);
assert.strictEqual(table.players[2].turns, 4);
assert.deepStrictEqual(table.result.names, ["A"]);

var order = F.createGame({ names: ["A", "B", "C"] });
farkle(order, "A");
order.players[1].score = 8000;
order.players[1].onBoard = true;
bankSix(order, "B", [6, 6, 6, 6, 6, 6]);
assert.strictEqual(order.players[1].score, 11000);
assert.deepStrictEqual(order.pendingLast, [2, 0]);
assert.strictEqual(order.players[order.current].name, "C");

var tied = F.createGame({ names: ["A", "B"] });
tied.players[0].score = 9000;
tied.players[0].onBoard = true;
bankSix(tied, "A", [6, 6, 6, 6, 6, 6]);
assert.strictEqual(tied.players[tied.current].name, "B");
F.beginTurn(tied);
var chain;
for (chain = 0; chain < 4; chain++) {
  var faces = chain % 2 === 0 ? [6, 6, 6, 6, 6, 6] : [5, 5, 5, 5, 5, 5];
  assert.strictEqual(F.roll(tied, faces), true);
  F.selectBest(tied);
  assert.strictEqual(F.selectionInfo(tied).allTaken, true);
}
assert.strictEqual(F.bankTotal(tied), 12000);
assert.strictEqual(F.bank(tied), true);
assert.strictEqual(tied.over, true);
assert.strictEqual(tied.result.type, "tie");
assert.deepStrictEqual(tied.result.names, ["A", "B"]);

var ahead = F.createGame({ names: ["A", "B"] });
ahead.players[0].score = 7000;
ahead.players[0].onBoard = true;
bankSix(ahead, "A", [6, 6, 6, 6, 6, 6]);
F.beginTurn(ahead);
F.roll(ahead, [6, 6, 6, 6, 6, 6]);
F.selectBest(ahead);
F.roll(ahead, [6, 6, 6, 6, 6, 6]);
F.selectBest(ahead);
F.roll(ahead, [6, 6, 6, 6, 6, 6]);
F.selectBest(ahead);
F.roll(ahead, [6, 6, 6, 6, 6, 6]);
F.selectBest(ahead);
assert.strictEqual(F.bank(ahead), true);
assert.strictEqual(ahead.result.type, "win");
assert.deepStrictEqual(ahead.result.names, ["B"]);

var bad = F.createGame({ names: ["Ada"] });
assert.strictEqual(F.roll(bad, [1, 1, 1]), false);
assert.strictEqual(bad.phase, "need-roll");
assert.strictEqual(bad.roll.length, 0);

var I = require("../i18n.js");
var trKeys = Object.keys(I.dict.tr).sort();
var enKeys = Object.keys(I.dict.en).sort();
assert.deepStrictEqual(trKeys, enKeys);
trKeys.forEach(function (key) {
  assert.strictEqual(typeof I.dict.tr[key], "string");
  assert.strictEqual(typeof I.dict.en[key], "string");
  assert.ok(I.dict.tr[key].length > 0);
  assert.ok(I.dict.en[key].length > 0);
});
assert.strictEqual(I.formatNumber("tr", 10000), "10.000");
assert.strictEqual(I.formatNumber("en", 10000), "10,000");
assert.strictEqual(I.formatNumber("tr", 500), "500");
assert.strictEqual(I.translate("tr", "wins", { name: "Ada" }), "Ada kazandı");
assert.strictEqual(I.translate("en", "turnBanner", { name: "Ada" }), "Ada's turn");
assert.strictEqual(I.translate("en", "missing"), "missing");

console.log("farkle tests passed");
