document.addEventListener('DOMContentLoaded', function () {
    const gameArea = document.getElementById('game-area');
    const bowl = document.getElementById('bowl');
    const startButton = document.getElementById('start-button');
    const endButton = document.getElementById('end-button');
    const resultDisplay = document.getElementById('result');
    const timerDisplay = document.getElementById('timer');

    let food = new Map([
        ['包子','../img/eat_img/包子.png'],
        ['蛋糕','../img/eat_img/蛋糕.png'],
        ['汉堡','../img/eat_img/汉堡.png'],
        ['饺子','../img/eat_img/饺子.png'],
        ['米饭','../img/eat_img/米饭.png'],
        ['面包','../img/eat_img/面包.png'],
        ['披萨','../img/eat_img/披萨.png'],
        ['热狗','../img/eat_img/热狗.png'],
        ['寿司','../img/eat_img/寿司.png'],
        ['薯条','../img/eat_img/薯条.png'],
        ['意面','../img/eat_img/意面.png']
    ]);
    let foodImages = Array.from(food.values());
    let foodNames = Array.from(food.keys());


    let score = {};
    let gameInterval;
    let countdownInterval;
    let gameDuration = 30; // 游戏时间 60 秒
    let bowlSpeed = 10; // 碗的移动速度
    let gameInProgress = false;//默认：未开始游戏

    // 初始化分数：每个image的数量
    function initScore() {
        foodImages.forEach((name) => {
            score[name] = 0;
        });
    }

    // 开始游戏
    function startGame() {
        initScore();
        gameInProgress = true;//开始游戏
        resultDisplay.textContent = '';
        timerDisplay.textContent = gameDuration; // 显示初始时间
        gameInterval = setInterval(dropFood, 800); // 每 800 毫秒生成一个食物
        countdownInterval = setInterval(updateTimer, 1000); // 每秒更新一次倒计时
        setTimeout(endGame, gameDuration * 1000); // 60 秒后结束游戏
    }

    // 结束游戏
    function endGame() {
        clearInterval(gameInterval);
        clearInterval(countdownInterval);
        gameInProgress = false;

        // 找出接到最多的食物
        const maxScore = Math.max(...Object.values(score));
        let maxFood = Object.keys(score).filter(food => score[food] === maxScore);

        // 创建一个新数组，包含与 maxFood 中的每个值对应的键
        let maxFoodNames = maxFood.map(foodImage => {
            // 通过遍历 Map，找到与图片路径对应的食物名称
            for (let [key, value] of food.entries()) {
                if (value === foodImage) {
                    return key; // 返回对应的食物名称
                }
            }
        });
        
        if(maxScore===0){//如果什么都没有接到
            resultDisplay.textContent = "什么都没接到，喝西北风吧";
        }
        else{
            resultDisplay.textContent = `游戏结束，你要到最多的食物是: ${maxFoodNames.join(', ')}`;
        }
        
    }

    // 更新倒计时
    function updateTimer() {
        let currentTime = parseInt(timerDisplay.textContent);
        if (currentTime > 0) {
            timerDisplay.textContent = currentTime - 1;
        }
    }

    // 生成随机食物
    function dropFood() {
        // 创建一个新的 <div> 元素，代表掉落的食物
        const foodElement = document.createElement('div');

        // 从 foodImages 数组中随机选择一个食物图片路径
        const randomFood = foodImages[Math.floor(Math.random() * foodImages.length)];

        // 将新创建的 <div> 元素赋予 'food' 这个类名，用于应用相应的 CSS 样式
        foodElement.className = 'food';

        // 将随机选择的食物图片设置为 <div> 的背景图
        foodElement.style.backgroundImage = `url(${randomFood})`;

        // 随机生成一个位置，将食物放在 gameArea 内部的随机横向位置
        // `gameArea.clientWidth - 40` 确保食物不会超出游戏区域的宽度
        foodElement.style.left = `${Math.random() * (gameArea.clientWidth - 40)}px`;

        // 将食物放置在 gameArea 的顶部，即垂直位置的初始值为 0
        foodElement.style.top = '0px';

        // 将食物的图片路径存储在 foodElement 的 dataset 属性中，用于标识该食物
        foodElement.dataset.foodId = randomFood;

        // 将新创建的食物元素添加到游戏区域 (gameArea) 中
        gameArea.appendChild(foodElement);

        // 使用 setInterval 定时器来控制食物的下落
        let fallInterval = setInterval(() => {
            // 获取当前食物的垂直位置（top 值）
            let foodTop = parseInt(foodElement.style.top);

            // 检查食物是否接近碗的高度区域（即 gameArea 底部 60px 范围内）
            if (foodTop >= gameArea.clientHeight - 60) {
                // 获取碗的左边缘位置
                let bowlLeft = parseInt(window.getComputedStyle(bowl).getPropertyValue('left'));

                // 计算碗的右边缘位置
                let bowlRight = bowlLeft + bowl.clientWidth;

                // 获取当前食物的左边缘位置
                let foodLeft = parseInt(foodElement.style.left);

                // 计算当前食物的右边缘位置
                let foodRight = foodLeft + foodElement.clientWidth;

                // 检查食物是否落入碗的范围内
                if (foodRight > bowlLeft && foodLeft < bowlRight) {
                    // 如果食物被碗接住，则增加该食物的计数
                    score[randomFood]++;

                    // 将接住的食物隐藏，不再显示在屏幕上
                    foodElement.style.visibility = 'hidden';

                    // 清除定时器，停止该食物的下落
                    clearInterval(fallInterval);
                }
                // 如果食物没有被碗接住，并且已经到达 gameArea 的底部
                else if (foodTop <= gameArea.clientHeight) {
                    // 将未接住的食物隐藏，不再显示在屏幕上
                    foodElement.style.visibility = 'hidden';

                    // 清除定时器，停止该食物的下落
                    clearInterval(fallInterval);
                }
            }
            // 如果食物还未到达碗的高度，则继续下落
            else {
                // 增加食物的 top 值，使其下落 5 像素
                foodElement.style.top = foodTop + 5 + 'px';
            }
        }, 50); // 每隔 50 毫秒执行一次，控制下落速度
    }



    // 控制碗左右移动
    document.addEventListener('keydown', function (event) {
        if (gameInProgress) { // 确保游戏正在进行时才允许移动
            // 获取碗的当前位置（左侧距离）
            let bowlLeft = parseInt(window.getComputedStyle(bowl).getPropertyValue('left'));

            // 如果按下的是左箭头键，并且碗的位置没有超出左边界
            if (event.key === 'ArrowLeft' && bowlLeft > 40) {
                // 碗向左移动，移动的距离由 bowlSpeed 决定
                bowl.style.left = bowlLeft - bowlSpeed + 'px';
            }
            // 如果按下的是右箭头键，并且碗的位置没有超出右边界
            else if (event.key === 'ArrowRight' && bowlLeft < gameArea.clientWidth - 40) {
                // 碗向右移动，移动的距离由 bowlSpeed 决定
                bowl.style.left = bowlLeft + bowlSpeed + 'px';
            }
        }
    });

    // 点击开始按钮启动游戏
    startButton.addEventListener('click', function () {
        if (!gameInProgress) {
            startGame();
        }
    });

    // 点击结束按钮停止游戏
    endButton.addEventListener('click', function () {
        if (gameInProgress) {
            endGame(); // 调用结束游戏的函数
        }
    });



    //点歌
    const audioFiles = [
        '../audio/1.mp3',
        '../audio/2.mp3',
        '../audio/3.mp3',
        '../audio/4.mp3',
    ];

    const audioPlayer = document.getElementById('audio-player');
    const audioSource = document.getElementById('audio-source');
    const playButton = document.getElementById('play-random-audio');
    const pauseButton = document.getElementById('pause-audio');

    // 随机播放音频的函数
    function playRandomAudio() {
        const randomAudio = audioFiles[Math.floor(Math.random() * audioFiles.length)];
        audioSource.src = randomAudio;
        audioPlayer.load();
        audioPlayer.play();
    }
    // 暂停音频的函数
    function pauseAudio() {
        if (!audioPlayer.paused) {
            audioPlayer.pause();
        }
    }

    // 绑定按钮的点击事件
    playButton.addEventListener('click', playRandomAudio);

    // 绑定暂停按钮的点击事件
    pauseButton.addEventListener('click', pauseAudio);


});

