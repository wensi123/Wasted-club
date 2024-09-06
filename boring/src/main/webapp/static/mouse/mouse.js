let score = 0;  // 游戏分数初始化为0
let time = 30;  // 游戏时间初始化为30秒
let isGameOver = false;  // 游戏是否结束的标志
let currentDifficulty;  // 当前选择的游戏难度
let difficultySettings = {  // 定义不同难度的设置
    easy: { interval: 1500, maxMoles: 1 },  // 简单模式：地鼠出现时间间隔1.5秒，最多1只地鼠
    medium: { interval: 1000, maxMoles: 2 },  // 中等模式：地鼠出现时间间隔1秒，最多2只地鼠
    hard: { interval: 700, maxMoles: 3 }  // 困难模式：地鼠出现时间间隔0.7秒，最多3只地鼠
};

const scoreBoard = document.getElementById('score');  // 获取显示分数的元素
const timeBoard = document.getElementById('time');  // 获取显示时间的元素
const holes = document.querySelectorAll('.hole');  // 获取所有地鼠洞元素
const startScreen = document.getElementById('startScreen');  // 获取游戏开始屏幕
const gameGrid = document.getElementById('gameGrid');  // 获取游戏网格元素
const restartScreen = document.getElementById('restartScreen');  // 获取游戏结束重启屏幕
const restartButton = document.getElementById('restartButton');  // 获取重启按钮

// 音效
const hitSound = new Audio('sounds/hit.mp3');  // 击中地鼠时的音效
const missSound = new Audio('sounds/miss.mp3');  // 未击中时的音效

// 随机选择指定数量的地鼠洞
function randomHoles(num) {
    const selectedHoles = [];  // 保存被选中的地鼠洞
    const holeArray = Array.from(holes);  // 转换地鼠洞的 NodeList 为数组

    // 随机选择地鼠洞，直到选满指定数量
    while (selectedHoles.length < num) {
        const index = Math.floor(Math.random() * holeArray.length);  // 随机获取地鼠洞索引
        const hole = holeArray[index];  // 根据索引获取地鼠洞元素
        if (!selectedHoles.includes(hole)) {  // 确保没有重复选择相同的地鼠洞
            selectedHoles.push(hole);  // 添加到已选择的洞列表中
        }
    }

    return selectedHoles;  // 返回选择的地鼠洞
}

// 显示指定数量的地鼠
function showMoles(maxMoles) {
    const selectedHoles = randomHoles(maxMoles);  // 随机选择地鼠洞
    selectedHoles.forEach(hole => hole.classList.add('up'));  // 将选中的地鼠洞添加 "up" 类，显示地鼠

    setTimeout(() => {
        selectedHoles.forEach(hole => hole.classList.remove('up'));  // 一段时间后，隐藏地鼠
        if (!isGameOver) {
            showMoles(maxMoles);  // 如果游戏没有结束，继续显示地鼠
        }
    }, difficultySettings[currentDifficulty].interval);  // 根据当前难度设置显示间隔
}

// 开始游戏函数，传入难度参数
function startGame(difficulty) {
    currentDifficulty = difficulty;  // 设置当前难度
    score = 0;  // 重置分数
    time = 30;  // 重置时间为30秒
    isGameOver = false;  // 重置游戏结束标志
    scoreBoard.textContent = score;  // 更新分数显示
    timeBoard.textContent = time;  // 更新时间显示
    startScreen.style.display = 'none';  // 隐藏开始屏幕
    gameGrid.style.display = 'grid';  // 显示游戏网格
    scoreBoard.parentElement.style.display = 'block';  // 显示分数面板
    timeBoard.parentElement.style.display = 'block';  // 显示时间面板
    restartScreen.style.display = 'none';  // 隐藏重启屏幕

    showMoles(difficultySettings[currentDifficulty].maxMoles);  // 开始显示地鼠

    // 计时器，每秒减少时间
    const countdown = setInterval(() => {
        time--;  // 每秒时间减少1
        timeBoard.textContent = time;  // 更新时间显示
        if (time <= 0) {
            clearInterval(countdown);  // 时间到，清除计时器
            isGameOver = true;  // 标记游戏结束
            alert('游戏结束！您的得分是：' + score);  // 弹出结束提示
            endGame();  // 结束游戏
        }
    }, 1000);  // 每1000毫秒（1秒）执行一次
}

// 结束游戏函数
function endGame() {
    gameGrid.style.display = 'none';  // 隐藏游戏网格
    restartScreen.style.display = 'block';  // 显示重启屏幕
}

// 为每个地鼠洞添加点击事件监听
holes.forEach(hole => {
    hole.addEventListener('click', () => {
        if (hole.classList.contains('up') && !isGameOver) {  // 如果地鼠在洞外且游戏未结束
            score++;  // 分数增加
            scoreBoard.textContent = score;  // 更新分数显示
            hole.classList.remove('up');  // 隐藏点击的地鼠
            hitSound.play();  // 播放击中音效
        } else if (!isGameOver) {  // 如果点击时地鼠不在洞外且游戏未结束
            missSound.play();  // 播放未击中音效
        }
    });
});

// 为每个难度按钮添加点击事件
document.querySelectorAll('.difficulty-button').forEach(button => {
    button.addEventListener('click', () => {
        const difficulty = button.dataset.difficulty;  // 获取难度按钮的 data-difficulty 值
        startGame(difficulty);  // 开始对应难度的游戏
    });
});

// 重启按钮点击事件
restartButton.addEventListener('click', () => {
    startScreen.style.display = 'block';  // 显示开始屏幕
    restartScreen.style.display = 'none';  // 隐藏重启屏幕
    scoreBoard.parentElement.style.display = 'none';  // 隐藏分数面板
    timeBoard.parentElement.style.display = 'none';  // 隐藏时间面板
});
