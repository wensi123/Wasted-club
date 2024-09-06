package com.myapp.servlet;

import com.myapp.dao.User;
import com.myapp.dao.UserGameDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/clickGame")  // 确保路径正确，声明此 Servlet 对应的访问 URL
public class GameClickServlet extends HttpServlet {

    // 创建一个 UserGameDAO 实例，用于操作数据库中用户和游戏相关的数据
    private UserGameDAO UserGameDAO = new UserGameDAO();

    // 处理 POST 请求
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 设置请求和响应的字符编码为 UTF-8，确保可以正确处理中文字符
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");  // 响应类型设置为 JSON 格式
        response.setCharacterEncoding("UTF-8");

        // 从请求中获取游戏的中文名称（前端通过 POST 发送的参数）
        String gameName = request.getParameter("gameName");
        System.out.println("接收到的游戏名称 (从前端传递): " + gameName);  // 打印接收到的游戏名称，便于调试

        // 检查游戏名称是否为空或仅包含空白字符
        if (gameName == null || gameName.trim().isEmpty()) {
            System.out.println("错误: 游戏名称为空");  // 打印错误信息
            response.getWriter().write("{\"status\": \"error\", \"message\": \"Game name is missing\"}");  // 返回 JSON 错误信息
            return;  // 直接返回，停止后续执行
        }

        // 从 session 中获取当前登录的用户信息
        HttpSession session = request.getSession(false);  // 获取当前 session，参数 false 表示不创建新的 session
        User currentUser = (User) session.getAttribute("currentUser");  // 从 session 中获取保存的用户对象

        // 检查用户是否已登录
        if (currentUser == null) {
            System.out.println("错误: 用户未登录");  // 打印未登录的错误信息
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // 设置响应状态为 401 Unauthorized
            response.getWriter().write("{\"status\": \"error\", \"message\": \"User not logged in\"}");  // 返回用户未登录的错误信息
            return;  // 停止后续执行
        }

        // 获取当前用户的 ID
        int userId = currentUser.getUserId();
        System.out.println("当前用户 ID: " + userId);  // 打印当前用户的 ID

        // 根据游戏名称从数据库中查找对应的游戏 ID
        int gameId = com.myapp.dao.UserGameDAO.getGameIdByName(gameName);
        System.out.println("查询到的游戏 ID: " + gameId);  // 打印查询到的游戏 ID

        // 如果未找到游戏 ID，返回错误信息
        if (gameId == -1) {
            System.out.println("错误: 未找到游戏 " + gameName);  // 打印错误信息
            response.getWriter().write("{\"status\": \"error\", \"message\": \"Game not found\"}");  // 返回游戏未找到的错误信息
            return;  // 停止后续执行
        }

        // 保存用户和游戏信息到 usergame 表中
        com.myapp.dao.UserGameDAO.saveUserGame(userId, gameId);
        System.out.println("成功记录用户和游戏信息 (userId: " + userId + ", gameId: " + gameId + ")");  // 打印成功记录的信息

        // 返回成功的 JSON 响应
        response.getWriter().write("{\"status\": \"success\"}");  // 返回成功状态
    }

    // 你可以选择重写 doGet 方法，并返回错误（如果只允许 POST 请求访问此 Servlet）
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendError(HttpServletResponse.SC_METHOD_NOT_ALLOWED, "GET method is not allowed.");  // 禁止 GET 请求访问，并返回 405 状态码
    }
}
