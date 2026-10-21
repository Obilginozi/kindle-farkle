(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Farkle = api;
})(typeof self !== "undefined" ? self : this, function () {
  var GOAL = 10000;
  var OPENING = 500;

  function threeOfKind(face, rules) {
    if (rules === "classic" && face === 1) return 1000;
    if (face === 1) return 300;
    return face * 100;
  }

  function groupScore(face, count, rules) {
    if (count === 1) {
      if (face === 1) return 100;
      if (face === 5) return 50;
      return -1;
    }
    if (count < 3 || count > 6) return -1;
    var three = threeOfKind(face, rules);
    if (rules === "classic") return three * (count - 2);
    if (count === 3) return three;
    if (count === 4) return 1000;
    if (count === 5) return 2000;
    return 3000;
  }

  function specialScore(counts) {
    var total = 0;
    var singles = 0;
    var pairs = 0;
    var trips = 0;
    var fours = 0;
    var distinct = 0;
    for (var face = 1; face <= 6; face++) {
      var n = counts[face];
      total += n;
      if (n === 0) continue;
      distinct += 1;
      if (n === 1) singles += 1;
      else if (n === 2) pairs += 1;
      else if (n === 3) trips += 1;
      else if (n === 4) fours += 1;
    }
    if (total !== 6) return -1;
    if (distinct === 6 && singles === 6) return 1500;
    if (pairs === 3) return 1500;
    if (trips === 2) return 2500;
    if (fours === 1 && pairs === 1) return 1500;
    return -1;
  }

  function scoreParts(counts, rules) {
    var remaining = 0;
    for (var face = 1; face <= 6; face++) remaining += counts[face];
    if (remaining === 0) return 0;

    var best = -1;
    for (var f = 1; f <= 6; f++) {
      if (counts[f] === 0) continue;
      var options = [];
      if (f === 1 || f === 5) options.push(1);
      for (var n = 3; n <= counts[f] && n <= 6; n++) options.push(n);
      for (var i = 0; i < options.length; i++) {
        var take = options[i];
        var gained = groupScore(f, take, rules);
        if (gained < 0) continue;
        counts[f] -= take;
        var rest = scoreParts(counts, rules);
        counts[f] += take;
        if (rest >= 0 && gained + rest > best) best = gained + rest;
      }
    }
    return best;
  }

  function countsOf(dice) {
    var counts = [0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < dice.length; i++) counts[dice[i]] += 1;
    return counts;
  }

  function validFaces(dice) {
    if (!dice || !dice.length || dice.length > 6) return false;
    for (var i = 0; i < dice.length; i++) {
      var face = dice[i];
      if (face !== (face | 0) || face < 1 || face > 6) return false;
    }
    return true;
  }

  function scoreDice(dice, rules) {
    if (!validFaces(dice)) return { valid: false, points: 0 };
    var counts = countsOf(dice);
    var best = scoreParts(counts, rules);
    var special = specialScore(counts);
    if (special > best) best = special;
    if (best < 0) return { valid: false, points: 0 };
    return { valid: true, points: best };
  }

  function betterPick(best, candidate) {
    if (!best) return true;
    if (candidate.points !== best.points) return candidate.points > best.points;
    return candidate.indices.length < best.indices.length;
  }

  function bestSubsetIndices(dice, rules) {
    if (!validFaces(dice)) return null;
    var best = null;
    var limit = 1 << dice.length;
    for (var mask = 1; mask < limit; mask++) {
      var indices = [];
      var subset = [];
      for (var i = 0; i < dice.length; i++) {
        if (mask & (1 << i)) {
          indices.push(i);
          subset.push(dice[i]);
        }
      }
      var scored = scoreDice(subset, rules);
      if (!scored.valid) continue;
      var candidate = { points: scored.points, indices: indices };
      if (betterPick(best, candidate)) best = candidate;
    }
    return best;
  }

  function cleanNames(names) {
    var cleaned = [];
    var source = names || [];
    for (var i = 0; i < source.length && cleaned.length < 4; i++) {
      var name = String(source[i] || "").replace(/\s+/g, " ").trim().slice(0, 16);
      if (name) cleaned.push(name);
    }
    return cleaned;
  }

  function createGame(options) {
    var names = cleanNames(options && options.names);
    if (!names.length) throw new Error("no players");
    var players = [];
    for (var i = 0; i < names.length; i++) {
      players.push({ name: names[i], score: 0, onBoard: false, turns: 0 });
    }
    return {
      rules: options && options.rules === "classic" ? "classic" : "official",
      players: players,
      current: 0,
      phase: players.length === 1 ? "need-roll" : "handoff",
      turnPoints: 0,
      lockedCount: 0,
      roll: [],
      selected: [],
      finalRound: false,
      pendingLast: [],
      over: false,
      result: null
    };
  }

  function clearTurn(state) {
    state.turnPoints = 0;
    state.lockedCount = 0;
    state.roll = [];
    state.selected = [];
  }

  function endGame(state) {
    var bestScore = 0;
    var i;
    for (i = 0; i < state.players.length; i++) {
      if (state.players[i].score > bestScore) bestScore = state.players[i].score;
    }
    var names = [];
    for (i = 0; i < state.players.length; i++) {
      if (state.players[i].score === bestScore) names.push(state.players[i].name);
    }
    state.over = true;
    state.phase = "over";
    state.result = {
      type: names.length > 1 ? "tie" : "win",
      names: names,
      score: bestScore
    };
    clearTurn(state);
  }

  function finishTurn(state) {
    var count = state.players.length;
    var idx = state.current;
    if (count === 1) {
      if (state.players[0].score >= GOAL) endGame(state);
      else {
        clearTurn(state);
        state.phase = "need-roll";
      }
      return;
    }
    if (!state.finalRound && state.players[idx].score >= GOAL) {
      state.finalRound = true;
      state.pendingLast = [];
      for (var step = 1; step < count; step++) {
        state.pendingLast.push((idx + step) % count);
      }
    } else if (state.finalRound) {
      state.pendingLast = state.pendingLast.filter(function (playerIndex) {
        return playerIndex !== idx;
      });
    }
    if (state.finalRound && state.pendingLast.length === 0) {
      endGame(state);
      return;
    }
    state.current = state.finalRound ? state.pendingLast[0] : (idx + 1) % count;
    clearTurn(state);
    state.phase = "handoff";
  }

  function beginTurn(state) {
    if (!state || state.over || state.phase !== "handoff") return false;
    clearTurn(state);
    state.phase = "need-roll";
    return true;
  }

  function selectionInfo(state) {
    if (!state || state.phase !== "pick" || !state.selected.length) {
      return { valid: false, points: 0, count: 0, allTaken: false };
    }
    var dice = [];
    for (var i = 0; i < state.selected.length; i++) dice.push(state.roll[state.selected[i]]);
    var scored = scoreDice(dice, state.rules);
    return {
      valid: scored.valid,
      points: scored.points,
      count: dice.length,
      allTaken: state.selected.length === state.roll.length
    };
  }

  function bankTotal(state) {
    var info = selectionInfo(state);
    if (!info.valid) return 0;
    return state.turnPoints + info.points;
  }

  function canBank(state) {
    if (!state || state.phase !== "pick") return false;
    var total = bankTotal(state);
    if (total <= 0) return false;
    var player = state.players[state.current];
    if (!player.onBoard && total < OPENING) return false;
    return true;
  }

  function canRoll(state) {
    if (!state || state.over) return false;
    if (state.phase === "need-roll") return true;
    if (state.phase !== "pick") return false;
    return selectionInfo(state).valid;
  }

  function randomDice(count, rng) {
    var dice = [];
    for (var i = 0; i < count; i++) dice.push(1 + Math.floor(rng() * 6));
    return dice;
  }

  function roll(state, dice, rng) {
    if (!state || state.over) return false;
    var count;
    var added = 0;
    var lockedAdd = 0;
    if (state.phase === "need-roll") {
      count = 6;
    } else if (state.phase === "pick") {
      var info = selectionInfo(state);
      if (!info.valid) return false;
      added = info.points;
      lockedAdd = info.count;
      count = info.allTaken ? 6 : state.roll.length - info.count;
    } else {
      return false;
    }
    var next = dice ? dice.slice() : randomDice(count, rng || Math.random);
    if (!validFaces(next) || next.length !== count) return false;
    state.turnPoints += added;
    state.lockedCount += lockedAdd;
    state.roll = next;
    state.selected = [];
    if (!bestSubsetIndices(state.roll, state.rules)) {
      state.phase = "farkle";
      state.turnPoints = 0;
      state.lockedCount = 0;
    } else {
      state.phase = "pick";
    }
    return true;
  }

  function toggleDie(state, index) {
    if (!state || state.phase !== "pick") return false;
    if (index !== (index | 0) || index < 0 || index >= state.roll.length) return false;
    var at = state.selected.indexOf(index);
    if (at >= 0) state.selected.splice(at, 1);
    else state.selected.push(index);
    return true;
  }

  function selectBest(state) {
    if (!state || state.phase !== "pick") return false;
    var best = bestSubsetIndices(state.roll, state.rules);
    if (!best) return false;
    state.selected = best.indices.slice();
    return true;
  }

  function bank(state) {
    if (!canBank(state)) return false;
    var player = state.players[state.current];
    player.score += bankTotal(state);
    player.onBoard = true;
    player.turns += 1;
    finishTurn(state);
    return true;
  }

  function acknowledgeFarkle(state) {
    if (!state || state.phase !== "farkle") return false;
    state.players[state.current].turns += 1;
    finishTurn(state);
    return true;
  }

  return {
    GOAL: GOAL,
    OPENING: OPENING,
    scoreDice: scoreDice,
    bestSubsetIndices: bestSubsetIndices,
    betterPick: betterPick,
    createGame: createGame,
    beginTurn: beginTurn,
    roll: roll,
    toggleDie: toggleDie,
    selectBest: selectBest,
    selectionInfo: selectionInfo,
    bankTotal: bankTotal,
    canBank: canBank,
    canRoll: canRoll,
    bank: bank,
    acknowledgeFarkle: acknowledgeFarkle
  };
});
