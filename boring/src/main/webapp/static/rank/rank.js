document.addEventListener('DOMContentLoaded', function() {
    // 发送请求到 LeaderboardServlet 获取用户排名数据
    fetch('/MyWebApp/leaderboard', { // 路径根据你的项目实际路径修改
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(data => {
            console.log("Fetched leaderboard data: ", data);
            // 通过返回的数据展示用户列表
            displayUsers(data);
        })
        .catch(error => {
            console.error("Error fetching leaderboard data:", error);
            let errorMessage = document.getElementById("error-message");
            errorMessage.textContent = "Error fetching leaderboard data: " + error.message;
            errorMessage.style.display = 'block';
        });
});

function displayUsers(users) {
    const sidebar = document.querySelector('.sidebar');
    sidebar.innerHTML = ''; // 清空现有的用户列表

    //统一的头像文件夹路径，与rank文件夹同级的img/userpicture文件夹
    const avatarBasePath = '../img/userpicture/';
    const defaultAvatar = '../img/default-avatar.png'; // 如果没有profile_picture时使用的默认头像

    users.forEach((user, index) => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';


        // 头像
        const avatar = document.createElement('img');
        if (user.profilePicture && user.profilePicture.trim() !== "") {
            avatar.src = avatarBasePath + user.profilePicture;
            // 如果profile_picture存在且不为空，使用该路径
        }
        else { avatar.src = defaultAvatar;
            // 如果没有获取到profile_picture，使用默认头像
        } avatar.alt = user.username;
        userItem.appendChild(avatar);

        //用户信息
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';

        //用户名（昵称）
        const nickname = document.createElement('span');
        nickname.textContent = user.username;
        userInfo.appendChild(nickname);

        //在线时间（文本）
        const onlineTime = document.createElement('span');
        onlineTime.className = 'online-time';
        onlineTime.textContent = `在线时间：${user.onlineTime}s`;
        userInfo.appendChild(onlineTime);

        userItem.appendChild(userInfo);

        //进度圈
        const progressCircle = document.createElement('div');
        progressCircle.className = 'progress-circle';

        const rightHalf = document.createElement('div');
        rightHalf.className = 'half-circle right-half';

        const leftHalf = document.createElement('div');
        leftHalf.className = 'half-circle left-half';

        //进度圈内部文本
        const progressText = document.createElement('span');
        progressText.textContent = `${user.onlineTime}s`;

        // 计算进度（假设100000s为满）
        const progress = Math.min((user.onlineTime / 100000) * 360, 360);

        // 设置旋转角度
        if (progress <= 180) {
            rightHalf.style.transform = `rotate(${progress}deg)`;
            leftHalf.style.transform = 'rotate(180deg)';
        } else {
            rightHalf.style.transform = 'rotate(180deg)';
            leftHalf.style.transform = `rotate(${progress - 180}deg)`;
        }

        // 添加左右半部分
        progressCircle.appendChild(rightHalf);
        progressCircle.appendChild(leftHalf);
        progressCircle.appendChild(progressText);
        userItem.appendChild(progressCircle);

        // 动态生成排名
        const rank = document.createElement('span');
        rank.className = 'rank';
        rank.textContent = `No.${index + 1}`;
        userItem.appendChild(rank);

        // 将用户项添加到侧边栏
        sidebar.appendChild(userItem);
    });
}
