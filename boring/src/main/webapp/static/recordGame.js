document.addEventListener('DOMContentLoaded', function() {
    // 当页面加载完毕并且 DOM 内容被完全加载时，执行这个函数

    const gameName = document.body.dataset.gameName; // 从 HTML 页面 <body> 标签中的自定义属性 data-game-name 获取游戏名称
    console.log("游戏名称 (从页面获取):", gameName);  // 打印获取到的游戏名称，方便调试

    // 检查是否成功获取到游戏名称
    if (gameName) {
        // 如果获取到的游戏名称不为空，执行以下操作，向服务器发送游戏名称

        fetch('/MyWebApp/clickGame', {  // 使用 fetch API 向服务器发送 POST 请求，URL 为 '/MyWebApp/clickGame'
            method: 'POST',  // 设定请求类型为 POST（用于发送数据）
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'  // 设置请求头，表示发送的数据类型为 URL 编码格式，并且明确指定字符编码为 UTF-8，防止乱码
            },
            body: `gameName=${encodeURIComponent(gameName)}`  // 发送的数据内容，将游戏名称作为参数，使用 encodeURIComponent 对其进行 URL 编码，确保特殊字符正确传递
        })
            .then(response => {
                // fetch 请求成功返回响应时，执行该回调
                console.log("收到响应状态:", response.status);  // 打印服务器响应的 HTTP 状态码（例如 200、404 等）

                // 检查响应是否成功（状态码为 200-299）
                if (!response.ok) {
                    console.error("请求失败，HTTP 状态码:", response.status);  // 如果响应状态码不是 200-299，表示请求失败，打印错误信息
                    throw new Error(`HTTP error! status: ${response.status}`);  // 抛出异常，终止后续代码执行
                }
                return response.json();  // 解析响应体为 JSON 格式，并返回解析后的结果
            })
            .then(data => {
                // 当响应成功解析为 JSON 数据时，执行该回调
                console.log("服务器返回的数据:", data);  // 打印服务器返回的数据，便于调试

                // 检查服务器返回的 JSON 数据中的状态
                if (data.status === 'success') {
                    console.log('游戏记录成功');  // 如果返回的状态为 'success'，表示游戏记录成功
                } else {
                    console.error('游戏记录失败:', data.message);  // 如果状态不是 'success'，表示失败，打印返回的错误信息
                }
            })
            .catch(error => {
                // 如果请求过程中出现错误（例如网络问题或服务器问题），执行该回调
                console.error('请求失败:', error);  // 打印错误信息
            });
    }
    // 如果未获取到游戏名称，则不会执行请求操作
});
