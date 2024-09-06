let audioFiles = []; // 用于存储选中的音频文件
let audioPlayer = document.getElementById('audio-player');
let randomPlayBtn = document.getElementById('random-play-btn');
let fileList = document.getElementById('file-list');
let randomTrackName = document.getElementById('random-track-name');
let currentTrackIndex = -1; // 当前播放的曲目索引
let isPlaying = false; // 当前是否在播放
let pausedTime = 0; // 记录暂停时的时间

// 用户选择文件夹时，读取其中的 MP3 文件
document.getElementById('folder-input').addEventListener('change', function(event) {
    audioFiles = []; // 清空当前的音频文件列表
    fileList.innerHTML = ''; // 清空文件列表展示
    let files = event.target.files;
    
    // 过滤并保存 MP3 文件
    for (let i = 0; i < files.length; i++) {
        if (files[i].name.endsWith('.mp3')) {
            audioFiles.push(files[i]);

            // 更新文件列表显示
            let listItem = document.createElement('li');
            listItem.textContent = files[i].name;
            fileList.appendChild(listItem);
        }
    }

    if (audioFiles.length > 0) {
        randomPlayBtn.disabled = false; // 启用随机播放按钮
    } else {
        randomPlayBtn.disabled = true; // 如果没有 MP3 文件则禁用按钮
    }
});

// 开始随机播放
randomPlayBtn.addEventListener('click', () => {
    const achievementId = 3;  // 假设这是完成的成就 ID
    localStorage.setItem('completedAchievement', achievementId.toString());
    playRandomTrack();
});

// 随机播放曲目的函数
function playRandomTrack() {
    let randomIndex = Math.floor(Math.random() * audioFiles.length);
    currentTrackIndex = randomIndex;
    let file = audioFiles[randomIndex];
    audioPlayer.src = URL.createObjectURL(file); // 从文件创建 URL
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    randomTrackName.textContent = `当前播放: ${file.name}`;
    isPlaying = true;
    stopBtn.disabled = false; // 启用停止播放按钮
    resumeBtn.disabled = true; // 禁用继续播放按钮
    randomPlayBtn.disabled = true; // 禁用开始随机按钮
}

// 当歌曲播放完毕时自动随机播放下一首
audioPlayer.addEventListener('ended', function() {
    playRandomTrack(); // 调用随机播放逻辑，播放下一首随机曲目
});


function redirectToWebsite() {
    // 将此处替换为你想要跳转的网站链接
    window.location.href = "https://www.myfreemp3.com.cn/";
};
