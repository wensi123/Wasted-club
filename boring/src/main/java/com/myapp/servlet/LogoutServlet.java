package com.myapp.servlet;

import com.myapp.dao.User;
import com.myapp.dao.UserDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.Duration;
import java.time.Instant;

@WebServlet("/logout")
public class LogoutServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);

        if (session != null) {
            User user = (User) session.getAttribute("currentUser");
            Instant loginTime = (Instant) session.getAttribute("loginTime");

            if (user != null && loginTime != null) {
                // 计算在线时长
                Instant logoutTime = Instant.now();
                long onlineDuration = Duration.between(loginTime, logoutTime).getSeconds();

                // 更新用户在线时长到数据库
                userDAO.updateOnlineTime(user.getUserId(), onlineDuration);

                // 输出登出的相关信息
                System.out.println("User " + user.getUsername() + " logged out. Online time: " + onlineDuration + " seconds.");
            } else {
                System.out.println("No user or login time found.");
            }

            // 清除会话数据
            session.invalidate();
        } else {
            System.out.println("No active session found for logout.");
        }

        // 设置响应内容类型为 JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();
        out.print("{\"status\": \"success\"}");
        out.flush();

        System.out.println("Logout successful.");
    }
}
