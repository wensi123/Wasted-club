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
import java.time.Instant;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        System.out.println(email);
        System.out.println(password);

        User user = userDAO.login(email, password);
        System.out.println("数据库返回的用户内容为"+user);

        // 设置响应内容类型为 JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // 获取输出流
        PrintWriter out = response.getWriter();

        if (user != null) {
            System.out.println("Login successful for user: " + user.getUsername());

            // 登录成功，创建会话并存储用户信息
            HttpSession session = request.getSession();
            session.setAttribute("currentUser", user);

            //记录当前登录时间，并将其存储到会话中
            session.setAttribute("loginTime", Instant.now());

            response.setStatus(HttpServletResponse.SC_OK);  // 设置状态码 200（OK）
            out.print("{\"status\": \"success\"}");
        } else {
            System.out.println("Login failed for email: " + email);
            // 登录失败，重定向回登录页面并显示错误
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // 设置状态码 401（Unauthorized）
            out.print("{\"status\": \"failure\", \"message\": \"Login failed. Check your credentials.\"}");
        }
        out.flush();  // 刷新输出流，确保内容被写入响应
    }
}
