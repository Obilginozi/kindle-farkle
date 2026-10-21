(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.FarkleI18n = api;
})(typeof self !== "undefined" ? self : this, function () {
  var dict = {
    tr: {
      downloading: "İndiriliyor…",
      readyOffline: "Çevrimdışı hazır. Uçak modunu aç.",
      onlineOnly: "Çevrimdışı kayıt yok. Oynamak için Wi-Fi açık kalsın.",
      updating: "Güncelleniyor…",
      updateOffline: "Güncellemek için Wi-Fi gerekir.",
      updateFailed: "Güncellenemedi.",
      update: "Güncelle",
      continue: "Devam et",
      newGame: "Yeni oyun",
      playerCount: "Oyuncu sayısı",
      scoring: "Puanlama",
      official: "Resmi",
      classic: "Klasik",
      rules: "Kurallar",
      names: "İsimler",
      start: "Başla",
      back: "Geri",
      home: "Ana sayfa",
      player: "Oyuncu",
      turnBanner: "Sıra: {name}",
      startTurn: "{name}, başla",
      roll: "Zar at",
      rollAll: "6 zarı yeniden at",
      bank: "Yaz",
      bankPoints: "Yaz {points}",
      thisTurn: "Bu tur {points}",
      aside: "Kenara alınan: {count}",
      tapDice: "Puanlı zarlara dokun",
      invalid: "Bu seçim puan değil",
      need500: "İlk yazma için {points} puan gerekir",
      bestScore: "En yüksek puan",
      farkleLost: "Bu turun puanı silindi",
      cont: "Devam",
      allScored: "Tüm zarlar puanlandı",
      finalRound: "Son tur",
      wins: "{name} kazandı",
      tie: "Berabere",
      turns: "{count} tur",
      soloBest: "En iyi sonuç: {count} tur",
      goal: "Hedef {points}",
      rulesIntro: "Sıran gelince altı zar at. Aynı atıştan puanlı zarları seç. En az bir zar ayırmadan devam edilmez.",
      rulesSeparate: "Farklı atışların zarları birleşmez. Bir 5 ile sonraki iki 5, üç 5 olmaz.",
      hotRule: "Altı zar da puanlanırsa puan durur ve altı zar yeniden atılabilir.",
      farkleRule: "Atışta puanlı zar yoksa Farkle olur. Bu turun puanı silinir.",
      openRule: "İlk yazış için tur toplamı en az {points} olmalıdır. Sonraki turlarda her pozitif puan yazılabilir. Yazılan puan güvendedir.",
      winRule: "Biriken puan {goal} olunca diğer oyuncular birer tur daha oynar. En yüksek puan kazanır. Eşitlik berabere biter.",
      classicNote: "Klasik düzende üç 1, 1000 puandır. Dört, beş ve altı aynı zar, bu üçlünün 2, 3 ve 4 katıdır.",
      single1: "Tek 1",
      single5: "Tek 5",
      threeFace: "Üç {face}",
      fourFace: "Dört {face}",
      fiveFace: "Beş {face}",
      sixFace: "Altı {face}",
      straight: "1–6 sıralı",
      threePairs: "Üç çift",
      fourPair: "Dört aynı ve bir çift",
      twoTrips: "İki üçlü",
      preset: "Seçili düzen: {name}",
      miniScores: "Puanlar",
      miniStraight: "1–6",
      miniPairs: "3 çift",
      miniFull: "4+2",
      miniTrips: "2 üçlü"
    },
    en: {
      downloading: "Downloading…",
      readyOffline: "Ready offline. Turn on airplane mode.",
      onlineOnly: "No offline copy yet. Keep Wi-Fi on to play.",
      updating: "Updating…",
      updateOffline: "Wi-Fi is required to update.",
      updateFailed: "Update failed.",
      update: "Update",
      continue: "Continue",
      newGame: "New game",
      playerCount: "Players",
      scoring: "Scoring",
      official: "Official",
      classic: "Classic",
      rules: "Rules",
      names: "Names",
      start: "Start",
      back: "Back",
      home: "Home",
      player: "Player",
      turnBanner: "{name}'s turn",
      startTurn: "Start {name}",
      roll: "Roll",
      rollAll: "Roll all 6 again",
      bank: "Bank",
      bankPoints: "Bank {points}",
      thisTurn: "This turn {points}",
      aside: "Set aside: {count}",
      tapDice: "Tap scoring dice",
      invalid: "This selection does not score",
      need500: "The first bank needs {points} points",
      bestScore: "Best score",
      farkleLost: "This turn's points are lost",
      cont: "Continue",
      allScored: "All dice scored",
      finalRound: "Final round",
      wins: "{name} wins",
      tie: "Tie",
      turns: "{count} turns",
      soloBest: "Best result: {count} turns",
      goal: "Goal {points}",
      rulesIntro: "On your turn, roll six dice. Set aside scoring dice from that same roll. You must keep at least one.",
      rulesSeparate: "Dice from different rolls do not combine. A 5 now and two 5s later are not three 5s.",
      hotRule: "If all six dice score, the points stay and you may roll all six again.",
      farkleRule: "If a roll has no scoring dice, it is a Farkle. The points for this turn are lost.",
      openRule: "Your first bank needs at least {points} points this turn. After that, any positive total can be banked. Banked points are safe.",
      winRule: "At {goal} points, each other player gets one last turn. The highest score wins. A tie is shared.",
      classicNote: "In classic scoring, three 1s are 1,000. Four, five, and six of a kind are 2, 3, and 4 times that three of a kind.",
      single1: "Single 1",
      single5: "Single 5",
      threeFace: "Three {face}s",
      fourFace: "Four {face}s",
      fiveFace: "Five {face}s",
      sixFace: "Six {face}s",
      straight: "1–6 straight",
      threePairs: "Three pairs",
      fourPair: "Four of a kind and a pair",
      twoTrips: "Two triplets",
      preset: "Selected rules: {name}",
      miniScores: "Scores",
      miniStraight: "1–6",
      miniPairs: "3 pairs",
      miniFull: "4+2",
      miniTrips: "2 trips"
    }
  };

  function translate(lang, key, vars) {
    var table = dict[lang] || dict.tr;
    var text = Object.prototype.hasOwnProperty.call(table, key) ? table[key] : dict.tr[key];
    if (text == null) return key;
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, function (_, name) {
      return vars[name] == null ? "" : String(vars[name]);
    });
  }

  function formatNumber(lang, value) {
    var sign = value < 0 ? "-" : "";
    var digits = String(Math.abs(value | 0));
    var parts = [];
    while (digits.length > 3) {
      parts.unshift(digits.slice(-3));
      digits = digits.slice(0, -3);
    }
    parts.unshift(digits);
    return sign + parts.join(lang === "en" ? "," : ".");
  }

  return {
    dict: dict,
    translate: translate,
    formatNumber: formatNumber
  };
});
