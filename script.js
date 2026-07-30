const XP_PER_LEVEL = 100;
const STORAGE_KEY = "summerGoalGame2026";

/*
Each quest contains:

id: A unique name used by the program
name: The name shown on screen
icon: The emoji shown beside it
xp: How much experience it gives
category: Which character statistic it improves
type: Daily, weekly, or milestone
maximum: Total number of completions allowed
completed: How many times it has been completed
*/

const startingQuests = [
    {
        id: "water",
        name: "Drink 100 oz of water",
        icon: "💧",
        xp: 10,
        category: "wellness",
        type: "daily",
        maximum: 30,
        completed: 0
    },
    {
        id: "picking",
        name: "Breaking bad habits",
        icon: "👏",
        xp: 10,
        category: "wellness",
        type: "daily",
        maximum: 30,
        completed: 0
    },
    {
        id: "teeth",
        name: "Brush and floss",
        icon: "🦷",
        xp: 10,
        category: "wellness",
        type: "daily",
        maximum: 30,
        completed: 0
    },
    {
        id: "diet",
        name: "Consume 100g of protein",
        icon: "🍓",
        xp: 20,
        category: "wellness",
        type: "daily",
        maximum: 20,
        completed: 0
    },
    {
        id: "gym",
        name: "Complete a gym workout",
        icon: "🏋️",
        xp: 25,
        category: "strength",
        type: "weekly",
        maximum: 12,
        completed: 0
    },
    {
        id: "steps",
        name: "Walk 10,000 steps",
        icon: "👟",
        xp: 30,
        category: "strength",
        type: "weekly",
        maximum: 10,
        completed: 0
    },
    {
        id: "moody who",
        name: "Complete a 1hr study session",
        icon: "☕",
        xp: 25,
        category: "knowledge",
        type: "weekly",
        maximum: 8,
        completed: 0
    },
    {
        id: "declutter",
        name: "Clean or declutter one area",
        icon: "🧹",
        xp: 10,
        category: "wellness",
        type: "weekly",
        maximum: 8,
        completed: 0
    },
    {
        id: "recipe",
        name: "Try a new recipe",
        icon: "👩‍🍳",
        xp: 30,
        category: "knowledge",
        type: "milestone",
        maximum: 12,
        completed: 0
    },
    {
        id: "book",
        name: "Finish a book",
        icon: "📚",
        xp: 20,
        category: "knowledge",
        type: "milestone",
        maximum: 6,
        completed: 0
    },
    {
        id: "save",
        name: "Save another $100",
        icon: "💰",
        xp: 30,
        category: "wealth",
        type: "milestone",
        maximum: 10,
        completed: 0
    },
    {
        id: "test",
        name: "Score above 90 on a test",
        icon: "📝",
        xp: 50,
        category: "knowledge",
        type: "milestone",
        maximum: 5,
        completed: 0
    },
    {
        id: "travel",
        name: "Travel to a new place",
        icon: "✈️",
        xp: 100,
        category: "adventure",
        type: "milestone",
        maximum: 3,
        completed: 0
    },
    {
        id: "right-split",
        name: "Achieve the right split",
        icon: "🤸",
        xp: 100,
        category: "strength",
        type: "milestone",
        maximum: 1,
        completed: 0
    },
    {
        id: "left-split",
        name: "Achieve the left split",
        icon: "🤸",
        xp: 100,
        category: "strength",
        type: "milestone",
        maximum: 1,
        completed: 0
    },
    {
        id: "middle-split",
        name: "Achieve the middle split",
        icon: "🤸",
        xp: 100,
        category: "strength",
        type: "milestone",
        maximum: 1,
        completed: 0
    },
];

const rewards = [
    {
        level: 2,
        name: "Starbucks trip!",
        icon: "☕"
    },
    {
        level: 3,
        name: "Buy a new book from HPB",
        icon: "📕"
    },
    {
        level: 4,
        name: "Buy a workout top",
        icon: "👕"
    },
    {
        level: 5,
        name: "Buy the L'Occitane Hand Cream",
        icon: "✋"
    },
    {
        level: 6,
        name: "Have a movie night w/ a triple dipper",
        icon: "🍽️"
    },
    {
        level: 7,
        name: "New shoesss",
        icon: "👟"
    },
    {
        level: 8,
        name: "$50 shopping budget",
        icon: "🛍️"
    },
    {
        level: 9,
        name: "New workout set",
        icon: "🏋️"
    },
    {
        level: 10,
        name: "Buy a dress (budget $100)",
        icon: "👗"
    }
];

let gameState = {
    totalXp: 0,
    quests: structuredClone(startingQuests)
};

let currentFilter = "all";

const questListElement = document.getElementById("questList");
const rewardListElement = document.getElementById("rewardList");

const levelNumberElement = document.getElementById("levelNumber");
const xpTextElement = document.getElementById("xpText");
const totalXpTextElement = document.getElementById("totalXpText");
const xpProgressElement = document.getElementById("xpProgress");

const resetButton = document.getElementById("resetButton");
const messageElement = document.getElementById("message");

const statElements = {
    strength: document.getElementById("strengthStat"),
    knowledge: document.getElementById("knowledgeStat"),
    wellness: document.getElementById("wellnessStat"),
    faith: document.getElementById("faithStat"),
    wealth: document.getElementById("wealthStat"),
    adventure: document.getElementById("adventureStat")
};

function getLevel() {
    return Math.floor(gameState.totalXp / XP_PER_LEVEL) + 1;
}

function getXpInsideCurrentLevel() {
    return gameState.totalXp % XP_PER_LEVEL;
}

function calculateStatistics() {
    const statistics = {
        strength: 0,
        knowledge: 0,
        wellness: 0,
        faith: 0,
        wealth: 0,
        adventure: 0
    };

    gameState.quests.forEach((quest) => {
        const earnedXp = quest.xp * quest.completed;
        statistics[quest.category] += earnedXp;
    });

    return statistics;
}

function saveGame() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(gameState)
    );
}

function loadGame() {
    const savedGame = localStorage.getItem(STORAGE_KEY);

    if (!savedGame) {
        return;
    }

    try {
        const parsedGame = JSON.parse(savedGame);

        if (
            typeof parsedGame.totalXp === "number" &&
            Array.isArray(parsedGame.quests)
        ) {
            gameState = parsedGame;
        }
    } catch (error) {
        console.error("The saved game could not be loaded.", error);
    }
}

function showMessage(text) {
    messageElement.textContent = text;
    messageElement.classList.add("show");

    window.setTimeout(() => {
        messageElement.classList.remove("show");
    }, 2400);
}

function completeQuest(questId) {
    const quest = gameState.quests.find(
        (item) => item.id === questId
    );

    if (!quest) {
        return;
    }

    if (quest.completed >= quest.maximum) {
        showMessage("You have already finished this quest.");
        return;
    }

    const previousLevel = getLevel();

    quest.completed += 1;
    gameState.totalXp += quest.xp;

    const newLevel = getLevel();

    saveGame();
    renderGame();

    if (newLevel > previousLevel) {
        const unlockedReward = rewards.find(
            (reward) => reward.level === newLevel
        );

        if (unlockedReward) {
            showMessage(
                `Level ${newLevel}! You unlocked: ${unlockedReward.name}`
            );
        } else {
            showMessage(`You reached Level ${newLevel}!`);
        }
    } else {
        showMessage(`Quest complete! +${quest.xp} XP`);
    }
}

function undoQuest(questId) {
    const quest = gameState.quests.find(
        (item) => item.id === questId
    );

    if (!quest || quest.completed <= 0) {
        return;
    }

    quest.completed -= 1;
    gameState.totalXp = Math.max(
        0,
        gameState.totalXp - quest.xp
    );

    saveGame();
    renderGame();

    showMessage(`Removed one completion from ${quest.name}.`);
}

function createQuestCard(quest) {
    const card = document.createElement("article");
    card.className = "quest-card";

    const isFinished = quest.completed >= quest.maximum;

    if (isFinished) {
        card.classList.add("completed");
    }

    const icon = document.createElement("div");
    icon.className = "quest-icon";
    icon.textContent = quest.icon;

    const information = document.createElement("div");
    information.className = "quest-information";

    const title = document.createElement("h3");
    title.textContent = quest.name;

    const details = document.createElement("div");
    details.className = "quest-details";

    const xpTag = document.createElement("span");
    xpTag.className = "quest-tag";
    xpTag.textContent = `+${quest.xp} XP`;

    const categoryTag = document.createElement("span");
    categoryTag.className = "quest-tag";
    categoryTag.textContent =
        quest.category.charAt(0).toUpperCase() +
        quest.category.slice(1);

    const typeTag = document.createElement("span");
    typeTag.className = "quest-tag";
    typeTag.textContent =
        quest.type.charAt(0).toUpperCase() +
        quest.type.slice(1);

    details.append(xpTag, categoryTag, typeTag);

    const progressSection = document.createElement("div");
    progressSection.className = "quest-progress";

    const track = document.createElement("div");
    track.className = "quest-progress-track";

    const fill = document.createElement("div");
    fill.className = "quest-progress-fill";

    const progressPercentage =
        (quest.completed / quest.maximum) * 100;

    fill.style.width = `${progressPercentage}%`;

    track.appendChild(fill);

    const progressText = document.createElement("span");
    progressText.className = "quest-progress-text";
    progressText.textContent =
        `${quest.completed} of ${quest.maximum} completed`;

    progressSection.append(track, progressText);

    information.append(
        title,
        details,
        progressSection
    );

    const actions = document.createElement("div");
    actions.className = "quest-actions";

    const completeButton = document.createElement("button");
    completeButton.className = "complete-button";
    completeButton.type = "button";
    completeButton.textContent = isFinished
        ? "Finished"
        : "Complete";

    completeButton.disabled = isFinished;

    completeButton.addEventListener("click", () => {
        completeQuest(quest.id);
    });

    const undoButton = document.createElement("button");
    undoButton.className = "undo-button";
    undoButton.type = "button";
    undoButton.textContent = "Undo";
    undoButton.disabled = quest.completed === 0;

    undoButton.addEventListener("click", () => {
        undoQuest(quest.id);
    });

    actions.append(completeButton, undoButton);

    card.append(icon, information, actions);

    return card;
}

function renderQuests() {
    questListElement.innerHTML = "";

    const filteredQuests = gameState.quests.filter(
        (quest) =>
            currentFilter === "all" ||
            quest.type === currentFilter
    );

    filteredQuests.forEach((quest) => {
        const questCard = createQuestCard(quest);
        questListElement.appendChild(questCard);
    });
}

function renderRewards() {
    rewardListElement.innerHTML = "";

    const currentLevel = getLevel();

    rewards.forEach((reward) => {
        const card = document.createElement("article");
        const isUnlocked = currentLevel >= reward.level;

        card.className = isUnlocked
            ? "reward-card unlocked"
            : "reward-card locked";

        const icon = document.createElement("div");
        icon.className = "reward-icon";
        icon.textContent = isUnlocked ? reward.icon : "🔒";

        const information = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = reward.name;

        const description = document.createElement("p");
        description.textContent = isUnlocked
            ? `Unlocked at Level ${reward.level}`
            : `Reach Level ${reward.level} to unlock`;

        information.append(title, description);
        card.append(icon, information);

        rewardListElement.appendChild(card);
    });
}

function renderStatistics() {
    const statistics = calculateStatistics();

    Object.entries(statistics).forEach(
        ([category, value]) => {
            statElements[category].textContent = value;
        }
    );
}

function renderPlayerInformation() {
    const level = getLevel();
    const currentLevelXp = getXpInsideCurrentLevel();

    levelNumberElement.textContent = level;

    xpTextElement.textContent =
        `${currentLevelXp} / ${XP_PER_LEVEL} XP`;

    totalXpTextElement.textContent =
        `Total XP: ${gameState.totalXp}`;

    const progressPercentage =
        (currentLevelXp / XP_PER_LEVEL) * 100;

    xpProgressElement.style.width =
        `${progressPercentage}%`;

    xpProgressElement.parentElement.setAttribute(
        "aria-valuenow",
        currentLevelXp
    );
}

function renderGame() {
    renderPlayerInformation();
    renderStatistics();
    renderQuests();
    renderRewards();
}

function resetGame() {
    const confirmed = window.confirm(
        "Are you sure you want to erase all of your progress?"
    );

    if (!confirmed) {
        return;
    }

    gameState = {
        totalXp: 0,
        quests: structuredClone(startingQuests)
    };

    saveGame();
    renderGame();

    showMessage("Your game has been reset.");
}

document
    .querySelectorAll(".filter-button")
    .forEach((button) => {
        button.addEventListener("click", () => {
            currentFilter = button.dataset.filter;

            document
                .querySelectorAll(".filter-button")
                .forEach((item) => {
                    item.classList.remove("active");
                });

            button.classList.add("active");
            renderQuests();
        });
    });

resetButton.addEventListener("click", resetGame);

loadGame();
renderGame();