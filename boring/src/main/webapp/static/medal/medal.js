
// 显示弹窗功能
document.querySelector('.right-column .btn').addEventListener('click', function () {
    const popup = document.querySelector('.popup');
    const achievementsList = document.querySelector('.achievement-list');
    
    updateAchievements();
    // 设置弹窗的高度自适应成就列表的高度
    popup.style.height = 'auto';  // 设置弹窗高度为自动调整
    popup.style.display = 'block';  // 显示弹窗

});

// 关闭弹窗功能
document.querySelector('.close-popup').addEventListener('click', function () {
document.querySelector('.popup').style.display = 'none';
});

// 当用户点击“查看评论”按钮时，平滑滚动到评论区
document.querySelector('.left-column .btn:nth-child(2)').addEventListener('click', function () {
document.querySelector('.comment-section').scrollIntoView({ behavior: 'smooth' });
const receivedAchievementId = 11;  // 假设这是完成的成就 ID

// 存储成就信息到 localStorage
localStorage.setItem('completedAchievement', receivedAchievementId.toString());

});



// 新增功能：处理评论提交并显示在评论区
document.querySelector('.left-column .btn_sent').addEventListener('click', function() {
// 获取输入框中的评论内容
const commentText = document.querySelector('.comment-box').value;
localStorage.setItem('', '');
if (commentText.trim() !== "") {
    // 创建新的评论元素
    const newComment = document.createElement('div');
    newComment.classList.add('comment');

    newComment.innerHTML = `
        <img src="兔子挂牌.png" alt="User6 Avatar" class="avatar">
        <div class="comment-content">
            <h4>你</h4>
            <p>${commentText}</p>
        </div>
    `;

    // 将新评论插入到评论区的最上方
    const commentSection = document.querySelector('.comment-section');
    commentSection.insertBefore(newComment, commentSection.firstChild);

    // 清空输入框
    document.querySelector('.comment-box').value = "";
}
const receivedAchievementId = 4;  // 假设这是完成的成就 ID

// 存储成就信息到 localStorage
localStorage.setItem('completedAchievement', receivedAchievementId.toString());

// 查找对应的成就项

});
function updateAchievements() {
const completedAchievementId = localStorage.getItem('completedAchievement');
if (completedAchievementId) {
    const achievementItem = document.querySelector(`li[data-achievement-id="${completedAchievementId}"]`);
    if (achievementItem) {
        achievementItem.classList.remove('unachieved');
        achievementItem.classList.add('achieved');
    }
    // 清除 localStorage 中的成就信息，以免重复更新
    localStorage.removeItem('completedAchievement');
}
}