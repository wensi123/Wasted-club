const API = {
    getUserInfo: async function() {
        try {
            const response = await fetch('/MyWebApp/profile', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include' // 确保发送 cookies
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    },
    updateUserInfo: async function(userInfo) {
        try {
            const response = await fetch('/MyWebApp/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userInfo),
                credentials: 'include' // 确保发送 cookies
            });
            if (!response.ok) {
                throw new Error('Failed to update user info');
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating user info:', error);
            throw error;
        }
    },

uploadAvatar: function() {
    // 模拟上传头像
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
},

getOnlineTime: function() {
    // 模拟获取在线时长
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                weeklyHours: 35,
                monthlyHours: 150
            });
        }, 300);
    });
},
submitFeedback: function(feedback) {
    // 模拟提交反馈
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 500);
    });
} 
};

