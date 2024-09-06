// discovery.js

// 获取元素
const newPopupBackground = document.getElementById('new-popup-background'); // 获取全屏弹窗的背景元素

// 当点击“发现大陆”全屏弹窗时
newPopupBackground.addEventListener('click', () => {

    // 游戏页面及其相关信息
    // 定义一个包含游戏名称、对应页面和图片的数组
    const games = [
        {
            name: '今天吃什么',  // 游戏名称
            page: '../eat/eat.html',  // 游戏页面的路径
            images: ['../img/eat_img/eat1.png', '../img/eat_img/eat2.png']  // 游戏图片的路径数组
        },
        {
            name: '扫雷',
            page: '../minesweeper/Minesweeper.html',
            images: ['../img/mine_img/mine1.png', '../img/mine_img/mine2.png','../img/mine_img/mine3.png']
        },
        {
            name: '打地鼠',
            page: '../mouse/mouse.html',
            images: ['../img/mouse_img/mouse1.png', '../img/mouse_img/mouse2.png']
        },
        {
            name: '井字棋',
            page: '../tictactoe/Tictactoe.html',
            images: ['../img/tictactoe_img/tictactoe1.png.', '../img/tictactoe_img/tictactoe2.png']
        },
        {
            name: '音乐播放器',
            page: '../musicplayer/music.html',
            images: ['../img/music1.png']
        },
        {
            name: '蜘蛛纸牌',
            page: '../SpiderGame/spider.html',
            images: ['../img/spider_img/spider1.png', '../img/spider_img/spider2.png']
        },
        {
            name: '开始工作',
            page: '../work/work.html',
            images: ['../img/work1.png']
        },
    ];

    // 使用random函数随机选择一个游戏
    const randomIndex = Math.floor(Math.random() * games.length); // 生成随机索引，随机选择一个游戏
    const selectedGame = games[randomIndex]; // 获取随机选择的游戏信息

    // 将随机选择的游戏信息存储在 sessionStorage
    sessionStorage.setItem('selectedGamePage', selectedGame.page); // 存储游戏页面路径
    sessionStorage.setItem('selectedGameName', selectedGame.name); // 存储游戏名称
    sessionStorage.setItem('selectedGameImages', JSON.stringify(selectedGame.images)); // 存储游戏图片路径数组，转为 JSON 字符串
    sessionStorage.setItem('showGamePopup', 'true'); // 设置标记为 true，用于控制弹窗显示

    // 跳转到游戏弹窗页面
    window.location.href = '../game/game.html'; // 跳转到游戏弹窗页面，用于显示选定的游戏信息
});
