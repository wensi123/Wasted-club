package com.myapp.servlet;

import com.myapp.dao.User;
import com.myapp.dao.UserDAO;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.BufferedReader;

@WebServlet("/updateProfile")
public class UpdateProfileServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();
    private Gson gson = new Gson();

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        User currentUser = (User) session.getAttribute("currentUser");

        if (currentUser != null) {
            // 读取请求体中的 JSON 数据
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            String jsonString = sb.toString();

            // 解析 JSON 数据
            JsonObject jsonObject = gson.fromJson(jsonString, JsonObject.class);
            String username = jsonObject.get("username").getAsString();
            String email = jsonObject.get("email").getAsString();
            String bio = jsonObject.get("bio").getAsString();
            String password = jsonObject.has("password") ? jsonObject.get("password").getAsString() : null;

            // 更新用户对象
            currentUser.setUsername(username);
            currentUser.setEmail(email);
            currentUser.setBio(bio);
            if (password != null && !password.isEmpty()) {
                currentUser.setPassword(password);
            }

            // 更新数据库
            boolean updateSuccess = userDAO.updateUser(currentUser);

            // 准备响应
            JsonObject responseJson = new JsonObject();
            if (updateSuccess) {
                session.setAttribute("currentUser", currentUser); // 更新会话中的用户信息
                responseJson.addProperty("success", true);
                responseJson.addProperty("message", "Profile updated successfully");
            } else {
                responseJson.addProperty("success", false);
                responseJson.addProperty("message", "Failed to update profile");
            }

            // 发送 JSON 响应
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(gson.toJson(responseJson));
        } else {
            // 用户未登录，返回错误信息
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            JsonObject errorJson = new JsonObject();
            errorJson.addProperty("success", false);
            errorJson.addProperty("message", "User not logged in");
            response.getWriter().write(gson.toJson(errorJson));
        }
    }
}
