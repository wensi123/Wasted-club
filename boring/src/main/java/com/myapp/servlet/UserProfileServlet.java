package com.myapp.servlet;

import com.myapp.dao.User;
import com.myapp.dao.UserDAO;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/profile")
public class UserProfileServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();
    private Gson gson = new Gson();

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        User currentUser = (User) session.getAttribute("currentUser");

        if (currentUser != null) {
            // 从数据库获取用户的详细信息
            User userDetails = userDAO.getUserById(currentUser.getUserId());

            // 设置响应类型为 JSON
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            // 将用户详情转换为 JSON 并发送
            String userJson = gson.toJson(userDetails);
            response.getWriter().write(userJson);
        } else {
            // 用户未登录，返回错误信息
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"User not logged in\"}");
        }
    }
}
