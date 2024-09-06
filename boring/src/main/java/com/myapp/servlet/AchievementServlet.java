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
import java.util.List;

@WebServlet("/achievements")
public class AchievementServlet extends HttpServlet {

    private UserGameDAO userGameDAO = new UserGameDAO();

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        User currentUser = (User) session.getAttribute("currentUser");

        if (currentUser != null) {
            int userId = currentUser.getUserId();

            // 获取用户成就列表
            String userAchievements = UserGameDAO.getUserAchievements(userId);
            //发送一串文本或者发一串数字构成的json


            // 设置请求属性并转发到 JSP 页面
            request.setAttribute("userAchievements", userAchievements);
            request.getRequestDispatcher("achievements.jsp").forward(request, response);
        } else {
            // 用户未登录的情况下的处理
            response.sendRedirect("login.html");
        }
    }
}