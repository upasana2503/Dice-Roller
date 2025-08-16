class DiceRoller {
  constructor() {
    this.diceContainer = document.getElementById("diceContainer");
    this.diceCountSelect = document.getElementById("diceCount");
    this.rollBtn = document.getElementById("rollBtn");
    this.clearBtn = document.getElementById("clearBtn");
    this.currentResult = document.getElementById("currentResult");
    this.history = document.getElementById("history");
    this.targetSumInput = document.getElementById("targetSum");
    this.calculateBtn = document.getElementById("calculateBtn");
    this.probabilityResult = document.getElementById("probabilityResult");
    this.rollHistory = [];
    this.currentDiceCount = 1;
    this.diceElements = [];
    this.totalRolls = 0;

    this.init();
  }

  init() {
    this.rollBtn.addEventListener("click", () => this.rollDice());
    this.clearBtn.addEventListener("click", () => this.clearHistory());
    this.diceCountSelect.addEventListener("change", (e) => {
      this.updateDiceCount(parseInt(e.target.value));
      this.updateTargetSumRange();
    });
    this.calculateBtn.addEventListener("click", () =>
      this.calculateProbability()
    );
    this.targetSumInput.addEventListener("blur", () =>
      this.validateTargetSum()
    );

    // Clear localStorage once for testing - remove this line after testing
    // localStorage.removeItem("diceRollerHistory");

    // Load history from localStorage
    this.loadHistory();
    this.updateHistoryDisplay();

    // Initialize dice and probability calculator
    this.updateDiceCount(1);
    this.updateTargetSumRange();
  }

  createDiceElement(index) {
    const dice = document.createElement("div");
    dice.className = "dice";
    dice.setAttribute("data-dice", index + 1);

    dice.innerHTML = `
            <div class="face face-1">
                <div class="dot center"></div>
            </div>
            <div class="face face-2">
                <div class="dot top-left"></div>
                <div class="dot bottom-right"></div>
            </div>
            <div class="face face-3">
                <div class="dot top-left"></div>
                <div class="dot center"></div>
                <div class="dot bottom-right"></div>
            </div>
            <div class="face face-4">
                <div class="dot top-left"></div>
                <div class="dot top-right"></div>
                <div class="dot bottom-left"></div>
                <div class="dot bottom-right"></div>
            </div>
            <div class="face face-5">
                <div class="dot top-left"></div>
                <div class="dot top-right"></div>
                <div class="dot center"></div>
                <div class="dot bottom-left"></div>
                <div class="dot bottom-right"></div>
            </div>
            <div class="face face-6">
                <div class="dot top-left"></div>
                <div class="dot top-right"></div>
                <div class="dot middle-left"></div>
                <div class="dot middle-right"></div>
                <div class="dot bottom-left"></div>
                <div class="dot bottom-right"></div>
            </div>
        `;

    return dice;
  }

  updateDiceCount(count) {
    this.currentDiceCount = count;

    // Clear existing dice
    this.diceContainer.innerHTML = "";
    this.diceElements = [];

    // Create new dice
    for (let i = 0; i < count; i++) {
      const dice = this.createDiceElement(i);
      this.diceElements.push(dice);
      this.diceContainer.appendChild(dice);

      // Set initial position
      this.showFace(dice, 1);
    }

    // Update button text
    this.updateRollButtonText();
  }

  updateRollButtonText() {
    const diceText = this.currentDiceCount === 1 ? "Die" : "Dice";
    this.rollBtn.innerHTML = `<i class="fas fa-dice-d6"></i> Roll ${diceText}`;
  }

  rollDice() {
    // Disable button during animation
    this.rollBtn.disabled = true;

    // Add rolling animation to all dice
    this.diceElements.forEach((dice) => {
      dice.classList.add("rolling");
    });

    // Generate fresh random numbers for each die
    const rollResults = [];
    const numDice = this.currentDiceCount;

    for (let i = 0; i < numDice; i++) {
      rollResults.push(Math.floor(Math.random() * 6) + 1);
    }

    console.log("Fresh roll generated:", rollResults, "for", numDice, "dice");

    // Add visual feedback
    this.rollBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Rolling...';

    // Play roll animation for 1 second
    setTimeout(() => {
      // Remove rolling animation and show faces
      this.diceElements.forEach((dice, index) => {
        dice.classList.remove("rolling");
        if (index < rollResults.length) {
          this.showFace(dice, rollResults[index]);
        }
      });

      // Calculate total
      const rollTotal = rollResults.reduce((sum, result) => sum + result, 0);

      // Increment roll counter
      this.totalRolls++;

      console.log(
        "Displaying results:",
        rollResults,
        "Total:",
        rollTotal,
        "Roll #:",
        this.totalRolls
      );

      // Update display with fresh data
      this.updateCurrentResult(rollResults, rollTotal);
      this.addToHistory(rollResults, rollTotal);

      // Re-enable button
      this.rollBtn.disabled = false;
      this.updateRollButtonText();
    }, 1000);
  }

  showFace(diceElement, number) {
    // Reset all rotations
    diceElement.style.transform = "";

    // Apply rotation based on the face number
    switch (number) {
      case 1:
        diceElement.style.transform = "rotateX(0deg) rotateY(0deg)";
        break;
      case 2:
        diceElement.style.transform = "rotateX(0deg) rotateY(90deg)";
        break;
      case 3:
        diceElement.style.transform = "rotateX(0deg) rotateY(180deg)";
        break;
      case 4:
        diceElement.style.transform = "rotateX(0deg) rotateY(-90deg)";
        break;
      case 5:
        diceElement.style.transform = "rotateX(90deg) rotateY(0deg)";
        break;
      case 6:
        diceElement.style.transform = "rotateX(-90deg) rotateY(0deg)";
        break;
    }
  }

  updateCurrentResult(results, total) {
    console.log("updateCurrentResult called with:", results, "total:", total);

    if (this.currentDiceCount === 1) {
      // For single die, show just the number and roll count
      this.currentResult.innerHTML = `
        <div style="font-size: 4rem; margin-bottom: 10px; color: #ff6b6b; font-weight: bold;">${total}</div>
        <div style="font-size: 1rem; opacity: 0.7;">Roll #${this.totalRolls}</div>
      `;
    } else {
      // For multiple dice, show: TOTAL [dice1, dice2, dice3] in one line
      this.currentResult.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 10px; color: #ff6b6b; font-weight: bold;">${total} [${results.join(
        ", "
      )}]</div>
        <div style="font-size: 1rem; opacity: 0.7;">Roll #${
          this.totalRolls
        }</div>
      `;
    }

    this.currentResult.style.animation = "none";
    // Trigger reflow to restart animation
    this.currentResult.offsetHeight;
    this.currentResult.style.animation = "pulse 0.5s ease-in-out";
  }

  addToHistory(results, total) {
    console.log(
      "addToHistory called with:",
      results,
      "total:",
      total,
      "diceCount:",
      this.currentDiceCount
    );

    const timestamp = new Date().toLocaleTimeString();

    // Validate that results array matches current dice count
    if (results.length !== this.currentDiceCount) {
      console.warn(
        "Results length mismatch:",
        results.length,
        "vs",
        this.currentDiceCount
      );
      return;
    }

    // Validate that total matches sum of results
    const calculatedTotal = results.reduce((sum, result) => sum + result, 0);
    if (calculatedTotal !== total) {
      console.warn("Total mismatch:", calculatedTotal, "vs", total);
      total = calculatedTotal; // Use calculated total
    }

    const historyItem = {
      results: [...results], // Create a fresh copy
      total: total,
      diceCount: this.currentDiceCount,
      time: timestamp,
      id: Date.now(),
    };

    console.log("Created history item:", historyItem);

    this.rollHistory.unshift(historyItem);

    // Keep only last 15 rolls
    if (this.rollHistory.length > 15) {
      this.rollHistory = this.rollHistory.slice(0, 15);
    }

    this.saveHistory();
    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    if (this.rollHistory.length === 0) {
      this.history.innerHTML =
        '<p class="no-history">No rolls yet. Start rolling!</p>';
      return;
    }

    const historyHTML = this.rollHistory
      .map((item) => {
        console.log("History item:", item);

        const displayText =
          item.diceCount === 1
            ? item.results[0].toString()
            : `${item.total} [${item.results.join(", ")}]`;

        return `
          <div class="history-item" data-id="${item.id}">
            <span class="history-number">${displayText}</span>
            <span class="history-time">${item.time}</span>
          </div>
        `;
      })
      .join("");

    this.history.innerHTML = historyHTML;

    // Add entrance animation to new items
    const historyItems = this.history.querySelectorAll(".history-item");
    historyItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateX(-20px)";
      setTimeout(() => {
        item.style.transition = "all 0.3s ease";
        item.style.opacity = "1";
        item.style.transform = "translateX(0)";
      }, index * 50);
    });
  }

  clearHistory() {
    if (this.rollHistory.length === 0) {
      this.showNotification("No history to clear!", "info");
      return;
    }

    // Add confirmation
    if (confirm("Are you sure you want to clear the roll history?")) {
      this.rollHistory = [];
      this.totalRolls = 0; // Reset roll counter
      this.saveHistory();
      this.updateHistoryDisplay();
      this.currentResult.innerHTML =
        '<div style="font-size: 4rem;">-</div><div style="font-size: 1rem; opacity: 0.7;">Ready to roll!</div>';
      this.showNotification("History cleared successfully!", "success");
    }
  }

  saveHistory() {
    try {
      const dataToSave = {
        rollHistory: this.rollHistory,
        totalRolls: this.totalRolls,
      };
      localStorage.setItem("diceRollerHistory", JSON.stringify(dataToSave));
    } catch (error) {
      console.warn("Could not save history to localStorage:", error);
    }
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem("diceRollerHistory");
      if (saved) {
        const data = JSON.parse(saved);
        // Handle both old format (just array) and new format (object with rollHistory and totalRolls)
        if (Array.isArray(data)) {
          this.rollHistory = data;
          this.totalRolls = data.length; // Estimate from history length
        } else {
          this.rollHistory = data.rollHistory || [];
          this.totalRolls = data.totalRolls || 0;
        }
      }
    } catch (error) {
      console.warn("Could not load history from localStorage:", error);
      this.rollHistory = [];
      this.totalRolls = 0;
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <i class="fas fa-${
              type === "success" ? "check-circle" : "info-circle"
            }"></i>
            <span>${message}</span>
        `;

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
              type === "success"
                ? "rgba(0, 184, 148, 0.9)"
                : "rgba(116, 185, 255, 0.9)"
            };
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Probability Calculator Methods
  updateTargetSumRange() {
    const minSum = this.currentDiceCount;
    const maxSum = this.currentDiceCount * 6;
    this.targetSumInput.min = minSum;
    this.targetSumInput.max = maxSum;

    // Set default value to middle range
    const currentValue = parseInt(this.targetSumInput.value);
    if (currentValue < minSum || currentValue > maxSum) {
      this.targetSumInput.value = Math.floor((minSum + maxSum) / 2);
    }
  }

  validateTargetSum() {
    const value = parseInt(this.targetSumInput.value);
    const minSum = this.currentDiceCount;
    const maxSum = this.currentDiceCount * 6;

    // Only correct if the value is clearly out of bounds and not empty
    if (!isNaN(value)) {
      if (value < minSum) {
        this.targetSumInput.value = minSum;
      } else if (value > maxSum) {
        this.targetSumInput.value = maxSum;
      }
    }
  }

  calculateProbability() {
    const targetSum = parseInt(this.targetSumInput.value);
    const numDice = this.currentDiceCount;

    if (isNaN(targetSum)) {
      this.showNotification("Please enter a valid target sum!", "info");
      return;
    }

    const minSum = numDice;
    const maxSum = numDice * 6;

    if (targetSum < minSum || targetSum > maxSum) {
      this.showNotification(
        `Target sum must be between ${minSum} and ${maxSum} for ${numDice} dice!`,
        "info"
      );
      return;
    }

    // Calculate number of ways to achieve the target sum
    const ways = this.countWaysToSum(numDice, targetSum);
    const totalOutcomes = Math.pow(6, numDice);
    const probability = (ways / totalOutcomes) * 100;

    this.displayProbabilityResult(
      targetSum,
      ways,
      totalOutcomes,
      probability,
      numDice
    );
  }

  countWaysToSum(numDice, targetSum) {
    // Dynamic programming approach to count ways
    const dp = Array(numDice + 1)
      .fill(null)
      .map(() => Array(targetSum + 1).fill(0));

    // Base case: 0 dice, sum 0 = 1 way
    dp[0][0] = 1;

    // Fill the DP table
    for (let dice = 1; dice <= numDice; dice++) {
      for (let sum = 0; sum <= targetSum; sum++) {
        for (let face = 1; face <= 6; face++) {
          if (sum >= face) {
            dp[dice][sum] += dp[dice - 1][sum - face];
          }
        }
      }
    }

    return dp[numDice][targetSum];
  }

  displayProbabilityResult(
    targetSum,
    ways,
    totalOutcomes,
    probability,
    numDice
  ) {
    const diceText = numDice === 1 ? "die" : "dice";

    this.probabilityResult.innerHTML = `
      <div class="prob-percentage">${probability.toFixed(2)}%</div>
      <div class="prob-result-item">
        <span class="prob-label">Target Sum:</span>
        <span class="prob-value">${targetSum}</span>
      </div>
      <div class="prob-result-item">
        <span class="prob-label">Number of Dice:</span>
        <span class="prob-value">${numDice}</span>
      </div>
      <div class="prob-result-item">
        <span class="prob-label">Favorable Outcomes:</span>
        <span class="prob-value">${ways}</span>
      </div>
      <div class="prob-result-item">
        <span class="prob-label">Total Outcomes:</span>
        <span class="prob-value">${totalOutcomes}</span>
      </div>
      <div class="prob-ways">
        There ${ways === 1 ? "is" : "are"} <strong>${ways}</strong> way${
      ways === 1 ? "" : "s"
    } to roll a sum of <strong>${targetSum}</strong> with <strong>${numDice}</strong> ${diceText}.
      </div>
    `;

    // Add animation
    this.probabilityResult.style.opacity = "0";
    this.probabilityResult.style.transform = "translateY(10px)";
    setTimeout(() => {
      this.probabilityResult.style.transition = "all 0.3s ease";
      this.probabilityResult.style.opacity = "1";
      this.probabilityResult.style.transform = "translateY(0)";
    }, 100);
  }
}

// Statistics tracking
class DiceStats {
  constructor(diceRoller) {
    this.diceRoller = diceRoller;
    this.createStatsButton();
  }

  createStatsButton() {
    const statsBtn = document.createElement("button");
    statsBtn.innerHTML = '<i class="fas fa-chart-bar"></i> Stats';
    statsBtn.className = "stats-btn";
    statsBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: rgba(162, 155, 254, 0.2);
            color: #a29bfe;
            border: 2px solid #a29bfe;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(162, 155, 254, 0.2);
            transition: all 0.3s ease;
            z-index: 100;
            backdrop-filter: blur(10px);
        `;

    statsBtn.addEventListener("mouseenter", () => {
      statsBtn.style.transform = "translateY(-2px) scale(1.05)";
      statsBtn.style.background = "#a29bfe";
      statsBtn.style.color = "#000";
    });

    statsBtn.addEventListener("mouseleave", () => {
      statsBtn.style.transform = "translateY(0) scale(1)";
      statsBtn.style.background = "rgba(162, 155, 254, 0.2)";
      statsBtn.style.color = "#a29bfe";
    });

    statsBtn.addEventListener("click", () => this.showStats());

    document.body.appendChild(statsBtn);
  }

  showStats() {
    const history = this.diceRoller.rollHistory;

    if (history.length === 0) {
      this.diceRoller.showNotification("No rolls to analyze yet!", "info");
      return;
    }

    // Calculate statistics
    const singleDiceRolls = history.filter((roll) => roll.diceCount === 1);
    const multiDiceRolls = history.filter((roll) => roll.diceCount > 1);

    let singleDiceCounts = [0, 0, 0, 0, 0, 0];
    let totalSum = 0;
    let rollCount = 0;

    // Count single dice results
    singleDiceRolls.forEach((roll) => {
      singleDiceCounts[roll.results[0] - 1]++;
    });

    // Calculate average for all rolls
    history.forEach((roll) => {
      totalSum += roll.total;
      rollCount++;
    });

    const average = rollCount > 0 ? (totalSum / rollCount).toFixed(2) : 0;
    const mostCommonSingle =
      singleDiceCounts.length > 0
        ? singleDiceCounts.indexOf(Math.max(...singleDiceCounts)) + 1
        : "N/A";

    // Create stats modal
    const modal = document.createElement("div");
    modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            backdrop-filter: blur(5px);
        `;

    const statsContent = document.createElement("div");
    statsContent.style.cssText = `
            background: rgba(255,255,255,0.1);
            border: 2px solid rgba(255,255,255,0.2);
            color: white;
            padding: 30px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            backdrop-filter: blur(10px);
        `;

    statsContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #fff; margin-bottom: 10px;">
                    <i class="fas fa-chart-bar"></i> Dice Statistics
                </h2>
                <p style="color: rgba(255,255,255,0.8);">Based on your last ${
                  history.length
                } rolls</p>
            </div>
            
            ${
              singleDiceRolls.length > 0
                ? `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #74b9ff; margin-bottom: 15px;">Single Die Results</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)); gap: 10px;">
                    ${singleDiceCounts
                      .map(
                        (count, index) => `
                        <div style="text-align: center; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 10px; border: 1px solid rgba(255,255,255,0.2);">
                            <div style="font-size: 1.5rem; margin-bottom: 5px;">${
                              index + 1
                            }</div>
                            <div style="font-weight: 600; color: #74b9ff;">${count}</div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
            `
                : ""
            }
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.2);">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 600; color: #00b894;">${average}</div>
                        <div style="color: rgba(255,255,255,0.8);">Average Total</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 600; color: #ff6b6b;">${mostCommonSingle}</div>
                        <div style="color: rgba(255,255,255,0.8);">Most Common (1 die)</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 600; color: #a29bfe;">${
                          history.length
                        }</div>
                        <div style="color: rgba(255,255,255,0.8);">Total Rolls</div>
                    </div>
                </div>
            </div>
            
            <button onclick="this.closest('.modal').remove()" style="
                width: 100%;
                padding: 12px;
                background: rgba(116, 185, 255, 0.2);
                color: #74b9ff;
                border: 2px solid #74b9ff;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            " onmouseover="this.style.background='#74b9ff'; this.style.color='#000';" 
               onmouseout="this.style.background='rgba(116, 185, 255, 0.2)'; this.style.color='#74b9ff';">Close</button>
        `;

    modal.className = "modal";
    modal.appendChild(statsContent);
    document.body.appendChild(modal);

    // Close on background click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  const diceRoller = new DiceRoller();
  const diceStats = new DiceStats(diceRoller);

  // Add keyboard support
  document.addEventListener("keydown", (e) => {
    if (
      e.code === "Space" &&
      !e.target.matches("button, input, textarea, select")
    ) {
      e.preventDefault();
      if (!diceRoller.rollBtn.disabled) {
        diceRoller.rollDice();
      }
    }
  });

  // Add some fun easter eggs
  let konamiCode = [];
  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];

  document.addEventListener("keydown", (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }

    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
      diceRoller.showNotification(
        "🎉 Konami Code activated! You found the secret!",
        "success"
      );
      // Add rainbow effect to all dice
      diceRoller.diceElements.forEach((dice) => {
        dice.style.filter = "hue-rotate(0deg)";
        let hue = 0;
        const rainbowInterval = setInterval(() => {
          hue += 10;
          dice.style.filter = `hue-rotate(${hue}deg)`;
          if (hue >= 360) {
            clearInterval(rainbowInterval);
            dice.style.filter = "";
          }
        }, 100);
      });
      konamiCode = [];
    }
  });

  console.log("🎲 Die Roller loaded successfully!");
  console.log("💡 Tip: Press SPACE to roll the dice!");
  console.log("🎮 Try the Konami Code for a surprise!");
  console.log("🎯 Select 1-5 dice from the dropdown menu!");
});
