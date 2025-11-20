document.addEventListener("DOMContentLoaded", () => {
  const fishingArea = document.getElementById("fishing-area");
  const rods = [];
  const rodCount = 9;
  const lastCatchInfo = {};

  let unlockedRods = 1;
  const rodCosts = {
    2: 50,
    3: 150,
    4: 500,
    5: 1500,
    6: 5000,
    7: 15000,
    8: 50000,
    9: 150000,
  };

  let catcherHeightLevel = 0; // starts at level 0, base height 5px
  const catcherHeights = [5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]; // px values per level
  const catcherUpgradeCosts = [
    50, 100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 300000, 500000,
  ];

  let totalCaught = 0;
  let totalEscaped = 0;
  let totalMoney = 0;
  let unlockedAreas = [1];
  let currentArea = 1; // starts at area 1

  const areaCosts = {
    2: 100, // cost to unlock area 2
    3: 500,
    4: 2500,
    5: 8000,
    6: 20000,
    7: 50000,
    8: 150000,
    9: 500000,
    10: 2000000,
  };

  let catcherSpeedLevel = 1;
  const maxCatcherSpeedLevel = 10;
  const catcherSpeedCosts = {
    2: 50,
    3: 100,
    4: 500,
    5: 1000,
    6: 5000,
    7: 25000,
    8: 100000,
    9: 500000,
    10: 1000000,
  };
  const catcherSpeedValues = {
    1: 0.5,
    2: 0.7,
    3: 0.9,
    4: 1.1,
    5: 1.3,
    6: 1.5,
    7: 1.7,
    8: 1.9,
    9: 2.1,
    10: 2.5,
  };

  let catchSpeedLevel = 1; // starting level
  const maxCatchSpeedLevel = 10;
  const catchSpeedCosts = {
    2: 50,
    3: 100,
    4: 500,
    5: 1000,
    6: 5000,
    7: 25000,
    8: 100000,
    9: 500000,
  };
  const catchSpeedValues = {
    1: 40, // initial progress per second
    2: 45,
    3: 50,
    4: 55,
    5: 60,
    6: 70,
    7: 80,
    8: 90,
    9: 100,
  };

  let slackLevel = 1; // starting level
  const maxSlackLevel = 6; // 6 levels
  const slackCosts = {
    2: 50,
    3: 500,
    4: 5000,
    5: 25000,
    6: 50000,
  };
  const slackValues = {
    1: 40, // default
    2: 36,
    3: 32,
    4: 28,
    5: 24,
    6: 20,
  };

  let baitLevel = 1; // starting at 1
  const maxBaitLevel = 10;
  const baitCosts = {
    2: 50,
    3: 100,
    4: 500,
    5: 1000,
    6: 5000,
    7: 25000,
    8: 100000,
    9: 500000,
    10: 1000000,
  };
  const baitWeightMultiplier = {
    1: 0, // 0% extra weight chance
    2: 0.05,
    3: 0.1,
    4: 0.15,
    5: 0.2,
    6: 0.25,
    7: 0.3,
    8: 0.35,
    9: 0.4,
    10: 0.5, // max: 50% bias toward higher weights
  };

  const caughtDisplay = document.getElementById("caught");
  const escapedDisplay = document.getElementById("escaped");

  // Rarity behavior settings
  const raritySettings = {
    1: { min: 2, max: 4, interval: 2000 },
    2: { min: 3, max: 6, interval: 1800 },
    3: { min: 4, max: 8, interval: 1600 },
    4: { min: 5, max: 10, interval: 1400 },
    5: { min: 6, max: 12, interval: 1200 },
    6: { min: 8, max: 16, interval: 1000 },
    7: { min: 10, max: 20, interval: 700 },
    8: { min: 12, max: 25, interval: 500 },
    9: { min: 15, max: 30, interval: 400 },
    10: { min: 20, max: 40, interval: 250 },
  };

  const fishWeights = {
    1: { min: 0.05, max: 0.1 }, // Guppy, ~0.05-0.1 lb
    2: { min: 1, max: 5 }, // Catfish, 1-5 lb
    3: { min: 0.5, max: 2 }, // Perch
    4: { min: 5, max: 12 }, // Salmon
    5: { min: 20, max: 50 }, // Tuna
    6: { min: 15, max: 40 }, // Mahi-Mahi
    7: { min: 100, max: 300 }, // Swordfish
    8: { min: 200, max: 800 }, // Goliath Grouper
    9: { min: 150, max: 500 }, // Blue Marlin
    10: { min: 2000, max: 5000 }, // Great White Shark
  };

  const fishRecords = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
  };

  const fishNames = {
    1: "Guppy",
    2: "Catfish",
    3: "Perch",
    4: "Salmon",
    5: "Tuna",
    6: "Mahi-Mahi",
    7: "Swordfish",
    8: "Goliath Grouper",
    9: "Blue Marlin",
    10: "Great White Shark",
  };

  const fishPrices = {
    1: { min: 1, max: 10 }, // Guppy
    2: { min: 5, max: 20 }, // Catfish
    3: { min: 8, max: 30 }, // Perch
    4: { min: 10, max: 50 }, // Salmon
    5: { min: 25, max: 100 }, // Tuna
    6: { min: 40, max: 200 }, // Mahi-Mahi
    7: { min: 50, max: 500 }, // Swordfish
    8: { min: 100, max: 1000 }, // Goliath Grouper
    9: { min: 200, max: 2000 }, // Blue Marlin
    10: { min: 500, max: 10000 }, // Great White Shark
  };

  const areaRarityPools = {
    1: { 1: 90, 2: 9, 3: 1, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
    2: { 1: 40, 2: 50, 3: 9, 4: 1, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
    3: { 1: 25, 2: 50, 3: 20, 4: 5, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
    4: { 1: 15, 2: 40, 3: 30, 4: 12, 5: 3, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 },
    5: { 1: 10, 2: 30, 3: 35, 4: 15, 5: 8, 6: 2, 7: 0, 8: 0, 9: 0, 10: 0 },
    6: { 1: 5, 2: 25, 3: 30, 4: 20, 5: 12, 6: 7, 7: 1, 8: 0, 9: 0, 10: 0 },
    7: { 1: 3, 2: 20, 3: 25, 4: 20, 5: 15, 6: 10, 7: 5, 8: 1, 9: 1, 10: 0 },
    8: { 1: 2, 2: 15, 3: 20, 4: 20, 5: 15, 6: 12, 7: 8, 8: 5, 9: 2, 10: 1 },
    9: { 1: 1, 2: 10, 3: 15, 4: 20, 5: 18, 6: 15, 7: 10, 8: 8, 9: 2, 10: 1 },
    10: { 1: 0, 2: 5, 3: 10, 4: 15, 5: 18, 6: 20, 7: 17, 8: 12, 9: 2, 10: 1 },
  };

  function scheduleNextJump(r) {
    // Clear any existing pending timeout
    if (r.jumpTimeout) {
      clearTimeout(r.jumpTimeout);
      r.jumpTimeout = null;
    }

    // Schedule next jump using current r.jumpInterval
    r.jumpTimeout = setTimeout(() => {
      // perform jump
      const barHeight = r.rod.offsetHeight;
      const fishHeight = r.fish.offsetHeight;

      if (!barHeight || !fishHeight) {
        scheduleNextJump(r);
        return;
      }

      const jumpPercent = r.jumpMin + Math.random() * (r.jumpMax - r.jumpMin);
      const jumpPx = (jumpPercent / 100) * barHeight;
      const direction = Math.random() > 0.5 ? 1 : -1;

      r.fishPos += jumpPx * direction;
      r.fishPos = Math.max(0, Math.min(barHeight - fishHeight, r.fishPos));
      r.fish.style.top = r.fishPos + "px";

      scheduleNextJump(r);
    }, r.jumpInterval);
  }

  // create rods
  for (let i = 0; i < rodCount; i++) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("rod-wrapper");

    const rod = document.createElement("div");
    rod.classList.add("fishing-bar");

    const rodInfo = document.createElement("div");
    rodInfo.classList.add("rod-info");

    const fish = document.createElement("div");
    fish.classList.add("fish");

    const catcher = document.createElement("div");
    catcher.classList.add("catcher");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");

    const flash = document.createElement("div");
    flash.classList.add("flash");

    // Attach elements to rod
    rod.appendChild(fish);
    rod.appendChild(catcher);
    rod.appendChild(progressBar);
    rod.appendChild(flash);

    // Info panel
    const rarity = getRandomRarityForCurrentArea();
    const settings = raritySettings[rarity];

    // get last catch info for this rod index if any
    const last = lastCatchInfo[i] || null;
    const lastText = last
      ? `${last.name} – ${last.weight} lb - ${last.price} coins`
      : "—";
    rodInfo.innerHTML = `
  <div class="timer">Time: 0.0s</div>
  <div class="rarity">Fish: ${fishNames[rarity]}</div>
  <div class="last-info">Last: ${lastText}</div>
`;

    wrapper.appendChild(rod);
    wrapper.appendChild(rodInfo);

    fishingArea.appendChild(wrapper);

    const barHeight = rod.offsetHeight;
    const fishHeight = fish.offsetHeight;

    const breakBar = document.createElement("div");
    breakBar.classList.add("break-bar");
    rod.appendChild(breakBar);

    const rodState = {
      rod,
      fish,
      catcher,
      progressBar,
      flash,
      timerElement: rodInfo.querySelector(".timer"),
      rarityElement: rodInfo.querySelector(".rarity"),
      lastInfoElement: rodInfo.querySelector(".last-info"),

      fishPos: Math.random() * (barHeight - fishHeight),
      catcherPos: 0,
      progress: 0,
      rarity,

      jumpMin: settings.min,
      jumpMax: settings.max,
      jumpInterval: settings.interval,

      breakProgress: 0,
      breakBar,

      lastProgress: 0,
      graceTimer: 0,
      timeOnRod: 0,
      lastTickTime: Date.now(),
      jumpTimeout: null,
    };

    rodState.fish.style.top = rodState.fishPos + "px";
    rods.push(rodState);

    if (i + 1 > unlockedRods) {
      wrapper.classList.add("rod-locked");
      wrapper.style.opacity = "0.25";
    }

    scheduleNextJump(rodState);
  }

  function moveCatchersAndProgress() {
    const now = Date.now();

    rods.forEach((r) => {
      if (rods.indexOf(r) + 1 > unlockedRods) return;

      const barHeight = r.rod.offsetHeight;
      const fishHeight = r.fish.offsetHeight;
      const catcherHeight = r.catcher.offsetHeight;

      // Time delta
      const deltaTime = (now - r.lastTickTime) / 1000;
      r.lastTickTime = now;

      r.graceTimer += deltaTime;
      r.timeOnRod += deltaTime;
      r.timerElement.textContent = `Time: ${r.timeOnRod.toFixed(1)}s`;

      // CHASE FISH SLOWLY (upgrade later)
      const targetPos = r.fishPos - (catcherHeight - fishHeight) / 2;
      const chaseSpeed = catcherSpeedValues[catcherSpeedLevel];

      if (r.catcherPos < targetPos) {
        r.catcherPos = Math.min(r.catcherPos + chaseSpeed, targetPos);
      } else if (r.catcherPos > targetPos) {
        r.catcherPos = Math.max(r.catcherPos - chaseSpeed, targetPos);
      }

      r.catcher.style.top = r.catcherPos + "px";

      // Collision
      const fishTop = r.fishPos;
      const fishBottom = r.fishPos + fishHeight;
      const catcherTop = r.catcherPos;
      const catcherBottom = r.catcherPos + catcherHeight;

      const inCatcher = fishBottom > catcherTop && fishTop < catcherBottom;

      if (inCatcher) {
        r.progress += catchSpeedValues[catchSpeedLevel] * deltaTime;
      } else {
        r.progress -= slackValues[slackLevel] * deltaTime;
      }

      r.progress = Math.max(0, Math.min(100, r.progress));
      r.progressBar.style.height = r.progress + "%";

      // Catch fish
      if (r.progress >= 100) {
        spawnNewFish(r, true);
        return;
      }

      // Break free (after 3 seconds)
      if (r.graceTimer >= 3) {
        // Increase break progress at 10% per second
        r.breakProgress += 10 * deltaTime; // % per second
        r.breakProgress = Math.min(100, r.breakProgress);

        // Update break bar visual
        r.breakBar.style.height = r.breakProgress + "%";

        // Only break the fish if breakProgress surpasses current progress
        if (r.breakProgress > r.progress) {
          spawnNewFish(r, false);
          return;
        }
      } else {
        // Before 3s, keep break progress at 0
        r.breakProgress = 0;
        r.breakBar.style.height = "0%";
      }

      r.lastProgress = r.progress;
    });
  }

  function renderFishdex() {
    const fishdex = document.getElementById("fishdex");
    fishdex.innerHTML = ""; // clear previous cards

    for (let i = 1; i <= 10; i++) {
      const card = document.createElement("div");
      card.classList.add("fishdex-card");

      const name = document.createElement("div");
      const record = document.createElement("div");

      if (fishRecords[i] === 0) {
        name.textContent = "???"; // hidden until caught
        record.textContent = "Record: —";
        card.classList.add("uncaught"); // greyed out
      } else {
        name.textContent = fishNames[i]; // reveal name
        record.textContent = `Record: ${fishRecords[i]} lb`;

        const weightRange = fishWeights[i];
        if (fishRecords[i] >= weightRange.max * 0.999) {
          card.classList.add("gold");
        } else if (fishRecords[i] >= weightRange.max * 0.9) {
          card.classList.add("silver");
        } else {
          card.classList.add("bronze");
        }
      }

      card.appendChild(name);
      card.appendChild(record);
      fishdex.appendChild(card);
    }
  }

  function renderAreas() {
    const areasDiv = document.getElementById("areas");
    areasDiv.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement("button");
      btn.textContent = `Area ${i}`;

      if (!unlockedAreas.includes(i)) {
        btn.disabled = true; // not unlocked yet
        btn.textContent += " 🔒";
      }

      if (i === currentArea) {
        btn.style.fontWeight = "bold";
        btn.textContent += " ✅";
      }

      btn.addEventListener("click", () => {
        currentArea = i;
        renderAreas(); // refresh buttons
        // Only new fish spawned will use this area
      });

      areasDiv.appendChild(btn);
    }
  }

  function getRandomRarityForCurrentArea() {
    const pool = areaRarityPools[currentArea];
    const rand = Math.random() * 100; // 0–100%
    let cumulative = 0;

    for (let rarity = 1; rarity <= 10; rarity++) {
      cumulative += pool[rarity] || 0;
      if (rand <= cumulative) return rarity;
    }

    return 1; // fallback
  }

  function purchaseArea(area) {
    const cost = areaCosts[area];

    if (totalMoney < cost) {
      return;
    }

    totalMoney -= cost;
    unlockedAreas.push(area);

    document.getElementById("money").textContent = `Money: ${totalMoney}`;

    renderUpgrades();
    renderAreas();
  }

  function renderUpgrades() {
    const div = document.getElementById("upgrade-section");
    div.innerHTML = "";

    // ========== BUY NEXT ROD ==========
    const nextRod = unlockedRods < 9 ? unlockedRods + 1 : null;
    const rodBtn = document.createElement("button");
    rodBtn.classList.add("upgrade-button");

    if (nextRod) {
      const cost = rodCosts[nextRod];
      rodBtn.textContent = `Buy Rod ${nextRod} – ${cost} coins`;

      if (totalMoney >= cost) {
        rodBtn.onclick = () => buyRod(nextRod);
      } else {
        rodBtn.classList.add("disabled");
      }
    } else {
      rodBtn.textContent = "Rod Unlock Complete";
      rodBtn.classList.add("disabled");
    }
    div.appendChild(rodBtn);

    // ========== UNLOCK NEXT AREA ==========
    let nextArea = null;
    for (let i = 2; i <= 10; i++)
      if (!unlockedAreas.includes(i)) {
        nextArea = i;
        break;
      }

    const areaBtn = document.createElement("button");
    areaBtn.classList.add("upgrade-button");

    if (nextArea) {
      const cost = areaCosts[nextArea];
      areaBtn.textContent = `Unlock Area ${nextArea} – ${cost} coins`;

      if (totalMoney >= cost) {
        areaBtn.onclick = () => purchaseArea(nextArea);
      } else {
        areaBtn.classList.add("disabled");
      }
    } else {
      areaBtn.textContent = "Area Unlock Complete";
      areaBtn.classList.add("disabled");
    }
    div.appendChild(areaBtn);

    // ---------- CATCHER SPEED UPGRADE ----------
    const nextCatcherSpeedLevel = catcherSpeedLevel + 1;
    const catcherSpeedBtn = document.createElement("button");
    catcherSpeedBtn.classList.add("upgrade-button");

    if (catcherSpeedLevel < maxCatcherSpeedLevel) {
      const cost = catcherSpeedCosts[nextCatcherSpeedLevel];
      catcherSpeedBtn.textContent = `Increase Catcher Speed → Level ${nextCatcherSpeedLevel} – ${cost} coins`;

      if (totalMoney >= cost) {
        catcherSpeedBtn.onclick = () => {
          totalMoney -= cost;
          catcherSpeedLevel = nextCatcherSpeedLevel;
          document.getElementById("money").textContent = `Money: ${totalMoney}`;
          renderUpgrades();
        };
      } else catcherSpeedBtn.classList.add("disabled");
    } else {
      catcherSpeedBtn.textContent = "Catcher Speed Upgrade Complete";
      catcherSpeedBtn.classList.add("disabled");
    }
    div.appendChild(catcherSpeedBtn);

    // ========== CATCHER HEIGHT UPGRADE ==========
    const nextCatcherLevel = catcherHeightLevel + 1;
    const catcherBtn = document.createElement("button");
    catcherBtn.classList.add("upgrade-button");

    if (catcherHeightLevel < catcherHeights.length - 1) {
      const cost = catcherUpgradeCosts[catcherHeightLevel];
      const canAfford = totalMoney >= cost;
      catcherBtn.textContent = `Upgrade Catcher – ${cost} coins`;

      if (!canAfford) catcherBtn.classList.add("disabled");
      else catcherBtn.onclick = () => upgradeCatcher();
    } else {
      catcherBtn.textContent = "Catcher Upgrade Complete";
      catcherBtn.classList.add("disabled");
    }

    div.appendChild(catcherBtn);

    // ========== CATCH SPEED UPGRADE ==========
    const nextSpeedLevel = catchSpeedLevel + 1;
    const speedBtn = document.createElement("button");
    speedBtn.classList.add("upgrade-button");

    if (catchSpeedLevel < maxCatchSpeedLevel) {
      const cost = catchSpeedCosts[nextSpeedLevel];
      const canAfford = totalMoney >= cost;
      speedBtn.textContent = `Increase Catch Speed → Level ${nextSpeedLevel} – ${cost} coins`;

      if (!canAfford) speedBtn.classList.add("disabled");
      else
        speedBtn.onclick = () => {
          totalMoney -= cost;
          catchSpeedLevel = nextSpeedLevel;
          document.getElementById("money").textContent = `Money: ${totalMoney}`;
          renderUpgrades();
        };
    } else {
      speedBtn.textContent = "Catch Speed Upgrade Complete";
      speedBtn.classList.add("disabled");
    }

    div.appendChild(speedBtn);

    // ========== SLACK PROGRESS UPGRADE ==========
    const nextSlackLevel = slackLevel + 1;
    const slackBtn = document.createElement("button");
    slackBtn.classList.add("upgrade-button");

    if (slackLevel < maxSlackLevel) {
      const cost = slackCosts[nextSlackLevel];
      const canAfford = totalMoney >= cost;
      slackBtn.textContent = `Reduce Progress Loss → Level ${nextSlackLevel} – ${cost} coins`;

      if (!canAfford) slackBtn.classList.add("disabled");
      else
        slackBtn.onclick = () => {
          totalMoney -= cost;
          slackLevel = nextSlackLevel;
          document.getElementById("money").textContent = `Money: ${totalMoney}`;
          renderUpgrades();
        };
    } else {
      slackBtn.textContent = "Progress Loss Upgrade Complete";
      slackBtn.classList.add("disabled");
    }

    div.appendChild(slackBtn);

    // ---------- BAIT UPGRADE ----------
    const nextBaitLevel = baitLevel + 1;
    const baitBtn = document.createElement("button");
    baitBtn.classList.add("upgrade-button");

    if (baitLevel < maxBaitLevel) {
      const cost = baitCosts[nextBaitLevel];
      baitBtn.textContent = `Upgrade Bait (Increase Weight) → Level ${nextBaitLevel} – ${cost} coins`;

      if (totalMoney >= cost) {
        baitBtn.onclick = () => {
          totalMoney -= cost;
          baitLevel = nextBaitLevel;
          document.getElementById("money").textContent = `Money: ${totalMoney}`;
          renderUpgrades();
        };
      } else baitBtn.classList.add("disabled");
    } else {
      baitBtn.textContent = "Bait Upgrade Complete";
      baitBtn.classList.add("disabled");
    }
    div.appendChild(baitBtn);

    //   // ========== TEST COINS BUTTON ==========
    //   const testBtn = document.createElement("button");
    //   testBtn.classList.add("upgrade-button");
    //   testBtn.textContent = "Give 1,000,000 Coins (Test)";
    //   testBtn.onclick = () => {
    //     totalMoney += 1000000;
    //     document.getElementById("money").textContent = `Money: ${totalMoney}`;
    //     renderUpgrades(); // refresh upgrade buttons
    //   };
    //   div.appendChild(testBtn);
  }

  function updateCatcherHeights() {
    const height = catcherHeights[catcherHeightLevel];
    rods.forEach((r, index) => {
      if (index + 1 <= unlockedRods) {
        r.catcher.style.height = height + "px";
      }
    });
  }

  function upgradeCatcher() {
    const cost = catcherUpgradeCosts[catcherHeightLevel];
    if (totalMoney < cost) return alert("Not enough money!");

    totalMoney -= cost;
    catcherHeightLevel++; // move to next level

    document.getElementById("money").textContent = `Money: ${totalMoney}`;

    updateCatcherHeights(); // apply new height
    renderUpgrades(); // refresh buttons
  }

  function buyRod(rodNumber) {
    const cost = rodCosts[rodNumber];
    if (totalMoney < cost) return alert("Not enough money!");

    totalMoney -= cost;
    unlockedRods = rodNumber;

    document.getElementById("money").textContent = `Money: ${totalMoney}`;

    // Update rod visibility
    const wrappers = document.querySelectorAll(".rod-wrapper");
    wrappers.forEach((wrapper, index) => {
      if (index + 1 <= unlockedRods) {
        wrapper.classList.remove("rod-locked");
        wrapper.style.opacity = "1";
      }
    });

    renderUpgrades();
  }

  function spawnNewFish(r, caught = false) {
    const barHeight = r.rod.offsetHeight;
    const fishHeight = r.fish.offsetHeight;

    // Assign new weight first
    const weightRange = fishWeights[r.rarity];
    // store as number with 2 decimals
    const bias = baitWeightMultiplier[baitLevel] || 0;
    // Random number between 0 and 1, then apply bias to favor higher weight
    let rand = Math.random();
    rand = Math.pow(rand, 1 - bias); // higher bias → heavier fish
    r.fishWeight = Number(
      (weightRange.min + rand * (weightRange.max - weightRange.min)).toFixed(2)
    );

    if (caught) {
      totalCaught++;
      caughtDisplay.textContent = `Caught: ${totalCaught}`;

      const weightRange = fishWeights[r.rarity];
      const priceRange = fishPrices[r.rarity];

      const weightPercent =
        (r.fishWeight - weightRange.min) / (weightRange.max - weightRange.min);
      const earned =
        priceRange.min + weightPercent * (priceRange.max - priceRange.min);
      const earnedRounded = Math.round(earned);

      totalMoney += earnedRounded;
      // determine this rod's index
      const rodIndex = rods.indexOf(r);
      lastCatchInfo[rodIndex] = {
        name: fishNames[r.rarity],
        weight: r.fishWeight.toFixed(2),
        price: earnedRounded,
      };

      // update the UI for last info for this rod (if element available)
      if (r.lastInfoElement) {
        r.lastInfoElement.textContent = `Last: ${lastCatchInfo[rodIndex].name} – ${lastCatchInfo[rodIndex].weight} lb - ${lastCatchInfo[rodIndex].price} coins`;
      }

      document.getElementById("money").textContent = `Money: ${totalMoney}`;
      renderUpgrades();

      // Update record if this is a new record
      if (fishRecords[r.rarity] === 0 || r.fishWeight > fishRecords[r.rarity]) {
        fishRecords[r.rarity] = r.fishWeight;
      }

      renderFishdex();
      r.flash.classList.add("success");
    } else {
      totalEscaped++;
      escapedDisplay.textContent = `Escaped: ${totalEscaped}`;
      r.flash.classList.add("failure");
    }

    setTimeout(() => r.flash.classList.remove("success", "failure"), 300);

    // Reset progress & timer
    r.progress = 0;
    r.progressBar.style.height = "0%";
    r.timeOnRod = 0;
    r.timerElement.textContent = "Time: 0.0s";

    r.breakProgress = 0;
    r.breakBar.style.height = "0%";

    // New rarity for next fish
    r.rarity = getRandomRarityForCurrentArea();
    const settings = raritySettings[r.rarity];
    r.jumpMin = settings.min;
    r.jumpMax = settings.max;
    r.jumpInterval = settings.interval;

    r.rarityElement.textContent = `Fish: ${fishNames[r.rarity]}`;

    // New position
    r.fishPos = Math.random() * (barHeight - fishHeight);
    r.fish.style.top = r.fishPos + "px";

    r.graceTimer = 0;
    r.lastProgress = 0;
    if (r.jumpTimeout) {
      clearTimeout(r.jumpTimeout);
      r.jumpTimeout = null;
    }
    scheduleNextJump(r);
  }

  // Game loop
  renderFishdex();
  renderUpgrades();
  renderAreas();
  updateCatcherHeights();
  setInterval(moveCatchersAndProgress, 50);
});
