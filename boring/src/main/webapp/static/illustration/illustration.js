function showPopup(element) {
    // 获取弹出框和用于放置克隆内容的内容区域
    var popup = document.getElementById('popup');  // 弹出框元素
    var popupSlotContent = document.getElementById('popup-slot-content');  // 弹出框内容区域

    // 克隆传入的槽位内容，并添加到弹出框中
    var clonedContent = element.cloneNode(true);  // 深度克隆传入的元素，包括其所有子节点
    clonedContent.onclick = null;  // 移除克隆元素的点击事件，防止点击弹出框中的内容再次触发弹出

    // 禁用克隆内容中的所有交互效果，避免悬停和点击
    clonedContent.style.pointerEvents = 'none';  // 禁用用户交互

    // 获取游戏的详细介绍内容，来自自定义的 `data-info` 属性
    var gameInfo = element.getAttribute('data-info');  // 通过元素的 `data-info` 属性获取游戏介绍

    // 查找克隆内容中的游戏名称框，并将其内容替换为游戏介绍
    var gameNameElement = clonedContent.querySelector('.game-name');  // 查找克隆内容中的游戏名称元素
    gameNameElement.textContent = gameInfo;  // 将游戏名称替换为游戏详细介绍

    // 动态调整样式：在弹出框中使用专门的 `.popup-game-info` 样式
    gameNameElement.classList.add('popup-game-info');  // 添加弹出框特有的样式
    gameNameElement.classList.remove('game-name');  // 可选操作，移除主页样式（如果需要与弹窗区分）

    // 清空弹出框内容区域中的任何旧内容
    popupSlotContent.innerHTML = '';  // 清空之前的内容

    // 将克隆的槽位内容添加到弹出框的内容区域中
    popupSlotContent.appendChild(clonedContent);  // 添加克隆的元素到弹出框

    // 显示弹出框
    popup.style.display = 'flex';  // 设置弹出框为可见，使用弹性布局显示
}

function closePopup() {
    // 隐藏弹出框
    var popup = document.getElementById('popup');  // 获取弹出框元素
    popup.style.display = 'none';  // 隐藏弹出框
}
