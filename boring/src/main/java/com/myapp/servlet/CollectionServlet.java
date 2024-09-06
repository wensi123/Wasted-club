package com.myapp.servlet;

import com.google.gson.Gson;
import com.myapp.dao.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@WebServlet("/illustration")
public class CollectionServlet extends HttpServlet {

    private GameDAO gameDAO = new GameDAO();
    private Gson gson = new Gson(); // 创建一个 Gson 实例

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 设置响应内容类型为 JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        User currentUser = (User) session.getAttribute("currentUser");

        if (currentUser != null) {
            int userId = currentUser.getUserId();

            // 获取用户发现的游戏列表
            List<Game> discoveredGames = gameDAO.getGamesDiscoveredByUser(userId);
            System.out.println("用户发现的游戏："+discoveredGames);

            // 将游戏列表转换为 JSON 字符串
            String json = gson.toJson(discoveredGames);

            // 将 JSON 响应发送给客户端
            response.getWriter().write(json);
        } else {
            // 用户未登录的情况下返回 401 未授权状态
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
