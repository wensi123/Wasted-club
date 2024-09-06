package com.myapp.servlet;

import com.myapp.dao.User;
import com.myapp.dao.UserDAO;
import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;


@WebServlet("/leaderboard")
public class LeaderboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 调用获取用户排名的方法
        UserDAO userDAO = new UserDAO();
        List<User> users = userDAO.getUsersByOnlineTime();
        // 打印从后端获取到的每个用户的profile_picture
        for (User user : users) {
            System.out.println("User ID: " + user.getUserId() + ", Profile Picture: " + user.getProfilePicture());
        }

        // 将用户列表转换为JSON格式
        Gson gson = new Gson();
        String json = gson.toJson(users);

        // 设置响应类型为JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // 将JSON写入响应输出流
        PrintWriter out = response.getWriter();
        out.print(json);
        out.flush();
    }
}