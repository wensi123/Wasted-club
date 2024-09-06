// script.js

let currentImageIndex = 0; // 当前显示的图片索引
let interval; // 用于存储定时器 ID，以便于轮播图片时使用

// 获取元素
const popupBackground = document.getElementById('popup-background'); // 获取弹窗背景元素
const gameImage = document.getElementById('game-image'); // 获取显示游戏图片的元素
const gameNameElement = document.getElementById('game-name'); // 获取显示游戏名称的元素

// 当页面加载时执行的操作
window.onload = function() {
    // 使用 sessionStorage 中的标记来判断是否显示弹窗
    if (sessionStorage.getItem('showGamePopup') === 'true') {
        popupBackground.style.display = 'flex'; // 显示弹窗

        // 获取并展示游戏名称
        const selectedGameName = sessionStorage.getItem('selectedGameName'); // 从 sessionStorage 获取选定的游戏名称
        gameNameElement.textContent = selectedGameName; // 将获取的游戏名称显示在弹窗中

        // 获取并展示游戏图片
        const selectedGameImages = JSON.parse(sessionStorage.getItem('selectedGameImages')); // 从 sessionStorage 获取选定的游戏图片数组
        if (selectedGameImages && selectedGameImages.length > 0) { // 如果图片数组存在并且不为空
            gameImage.src = selectedGameImages[0]; // 显示数组中的第一张图片
            startImageRotation(selectedGameImages); // 启动图片轮播功能
        }

        sessionStorage.removeItem('showGamePopup'); // 弹窗显示后，清除标记，避免弹窗再次显示
    }
};

// 确认操作，跳转到随机选择的游戏页面
function confirmAction() {
    const selectedGamePage = sessionStorage.getItem('selectedGamePage'); // 获取随机选择的游戏页面路径
    if (selectedGamePage) {
        window.open(selectedGamePage, '_blank'); // 在新窗口中打开游戏页面
    }
}

// 关闭弹窗并跳转到 home.html 页面
function closePopup() {
    popupBackground.style.display = 'none'; // 隐藏弹窗
    clearInterval(interval); // 停止图片轮播
    window.location.href = '../home/home.html'; // 跳转到首页 home.html
}

// 自动轮换图片
function startImageRotation(images) {
    interval = setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length; // 循环递增当前图片的索引
        gameImage.src = images[currentImageIndex]; // 更新图片显示为下一张
    }, 3000); // 每 3 秒切换一次图片
}

// 切换到下一张图片（手动）
function nextImage() {
    const images = JSON.parse(sessionStorage.getItem('selectedGameImages')); // 从 sessionStorage 获取图片数组
    currentImageIndex = (currentImageIndex + 1) % images.length; // 更新当前图片索引，循环切换到下一张
    gameImage.src = images[currentImageIndex]; // 更新显示的图片
}

// 切换到上一张图片（手动）
function prevImage() {
    const images = JSON.parse(sessionStorage.getItem('selectedGameImages')); // 从 sessionStorage 获取图片数组
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length; // 更新当前图片索引，循环切换到上一张
    gameImage.src = images[currentImageIndex]; // 更新显示的图片
}
