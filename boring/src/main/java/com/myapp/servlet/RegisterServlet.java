package com.myapp.servlet;

import com.myapp.dao.User;
import com.myapp.dao.UserDAO;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // 获取表单参数
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // 打印日志信息
        System.out.println("Username: " + username);
        System.out.println("Email: " + email);

        // 使用 DAO 注册新用户
        boolean registrationSuccess = userDAO.register(username, email, password);

        // 设置响应内容类型为 JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try (PrintWriter out = response.getWriter()) {
            if (registrationSuccess) {
                response.setStatus(HttpServletResponse.SC_OK);  // 设置状态码 200（OK）
                out.print("{\"status\": \"success\"}");
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);  // 设置状态码 500（Internal Server Error）
                out.print("{\"status\": \"failure\", \"message\": \"Registration failed.\"}");
            }
            out.flush();
        }
    }
}
