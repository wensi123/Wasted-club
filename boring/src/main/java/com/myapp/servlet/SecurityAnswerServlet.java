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

@WebServlet("/SecurityAnswer")
public class SecurityAnswerServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // 获取请求参数
        String email = request.getParameter("email");
        String answer = request.getParameter("answer");

        // 调试输出
        System.out.println("Email: " + email);
        System.out.println("Answer: " + answer);

        // 设置响应内容类型为 JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {
            // 校验密保问题是否正确
            if (userDAO.getSecurityAnswer(email, answer)) {
                // 密保问题答案正确，创建会话并存储用户信息
                HttpSession session = request.getSession();
                User user = userDAO.getUserByEmail(email); // 根据 email 获取用户信息
                session.setAttribute("currentUser", user); // 将用户信息存储到会话中

                // 返回成功的JSON响应，包含重定向的URL
                String redirectUrl = request.getContextPath() + "/static/home/home.html"; // 使用相对路径构建重定向 URL
                response.setStatus(HttpServletResponse.SC_OK);  // 状态码 200
                out.print("{\"status\": \"success\", \"redirect\": \"" + redirectUrl + "\"}");
            } else {
                // 密保问题答案错误
                System.out.println("密保问题回答错误"); // 调试信息
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // 状态码 401
                out.print("{\"status\": \"failure\", \"message\": \"密保问题回答错误！\"}");
            }
        } catch (Exception e) {
            // 处理异常情况
            System.out.println("服务器内部错误：" + e.getMessage()); // 调试信息
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 状态码 500
            out.print("{\"status\": \"error\", \"message\": \"服务器内部错误，请稍后再试。\"}");
            e.printStackTrace();
        } finally {
            out.flush();  // 刷新输出流，确保内容被写入响应
            out.close();  // 关闭输出流
        }
    }
}
