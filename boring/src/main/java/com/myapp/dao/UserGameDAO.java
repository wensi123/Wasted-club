package com.myapp.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UserGameDAO {
    public static int getGameIdByName(String gameName) {
        int gameId = -1; // 初始化游戏 ID 为 -1，表示如果未找到游戏，将返回 -1
        String sql = "SELECT game_id FROM Games WHERE game_name = ?";  // SQL 查询语句，查找与游戏名称对应的游戏 ID

        // 使用 try-with-resources 自动管理数据库资源
        try (Connection conn = DatabaseConnection.getConnection();  // 获取数据库连接
             PreparedStatement pstmt = conn.prepareStatement(sql)) {  // 预编译 SQL 查询语句

            pstmt.setString(1, gameName);  // 设置查询条件，将第一个占位符 ? 替换为传入的游戏名称
            ResultSet rs = pstmt.executeQuery();  // 执行查询操作，并获取查询结果集

            // 检查结果集中是否有数据
            if (rs.next()) {
                gameId = rs.getInt("game_id");  // 如果有结果，获取 game_id 列的值并赋给 gameId
            }

        } catch (SQLException e) {
            e.printStackTrace();  // 如果发生 SQL 异常，打印异常信息以便调试
        }

        return gameId;  // 返回游戏 ID，如果未找到对应游戏，则返回 -1
    }

    // 检查用户是否已经点击过该游戏
    public static boolean hasUserClickedGame(int userId, int gameId) {
        // SQL 查询语句，检查 usergames 表中是否存在指定用户和游戏的记录
        String sql = "SELECT COUNT(*) FROM usergames WHERE user_id = ? AND game_id = ?";

        // 使用 try-with-resources 自动管理数据库连接和语句对象
        try (Connection conn = DatabaseConnection.getConnection();  // 获取数据库连接
             PreparedStatement pstmt = conn.prepareStatement(sql)) {  // 预编译 SQL 语句

            // 设置查询条件，绑定第一个 ? 为 userId，第二个 ? 为 gameId
            pstmt.setInt(1, userId);
            pstmt.setInt(2, gameId);

            // 执行查询并获取结果集
            ResultSet rs = pstmt.executeQuery();

            // 如果有结果，获取第一列（COUNT(*) 的结果）
            if (rs.next()) {
                int count = rs.getInt(1);  // 获取查询结果中的计数值
                return count > 0;  // 如果 count > 0，说明用户已点击过该游戏
            }

        } catch (SQLException e) {
            // 捕获 SQL 异常并打印错误信息和堆栈跟踪
            System.err.println("Error checking if user has clicked game: " + e.getMessage());
            e.printStackTrace();
        }
        return false;  // 如果发生异常或查询无结果，返回 false，表示用户未点击过该游戏
    }

    // 保存用户游戏信息到 usergame 表中，前提是该用户未玩过该游戏
    public static void saveUserGame(int userId, int gameId) {
        // 首先检查用户是否已经点击过该游戏
        if (hasUserClickedGame(userId, gameId)) {
            // 如果用户已玩过该游戏，输出日志信息并跳过插入操作
            System.out.println("用户 " + userId + " 已玩过游戏 " + gameId + "，跳过插入。");
            return;  // 返回，终止函数执行
        }

        // 如果用户未玩过该游戏，准备插入新的记录
        String sql = "INSERT INTO usergames (user_id, game_id) VALUES (?, ?)";
        System.out.println("准备插入用户游戏记录 (userId: " + userId + ", gameId: " + gameId + ")");

        // 使用 try-with-resources 自动管理数据库连接和语句对象
        try (Connection conn = DatabaseConnection.getConnection();  // 获取数据库连接
             PreparedStatement pstmt = conn.prepareStatement(sql)) {  // 预编译 SQL 语句

            // 设置插入值，绑定第一个 ? 为 userId，第二个 ? 为 gameId
            pstmt.setInt(1, userId);
            pstmt.setInt(2, gameId);

            // 执行插入操作
            pstmt.executeUpdate();
            System.out.println("用户游戏记录插入成功");  // 插入成功后输出日志信息

        } catch (SQLException e) {
            // 捕获 SQL 异常并打印错误信息和堆栈跟踪
            System.out.println("插入用户游戏记录时发生错误: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // 插入用户游戏记录
    public void insertUserGame(int userId, int gameId, String achievement) {
        String sql = "INSERT INTO UserGames (user_id, game_id, achievements) VALUES (?, ?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            pstmt.setInt(2, gameId);
            pstmt.setString(3, achievement);

            pstmt.executeUpdate();

        } catch (SQLException e) {
            System.err.println("Error inserting user game record: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // 用户点击游戏时的处理逻辑
    public void handleUserGameClick(int userId, int gameId, String gameName) {
        // 首先检查用户是否已经点击过该游戏
        if (!hasUserClickedGame(userId, gameId)) {
            // 如果没有点击过，插入新记录
            String achievement = "第一次发现 " + gameName ;
            insertUserGame(userId, gameId, achievement);
        }
    }

    // 获取用户拥有的成就
    public static String getUserAchievements(int userId) {
        String sql = "SELECT user_achievement FROM users WHERE user_id = ?";
        String achievements = null;

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();

            // 检查是否有结果并移动到第一行
            if (rs.next()) {
                achievements = rs.getString("user_achievement");
            } else {
                System.out.println("No achievements found for user_id: " + userId);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return achievements;
    }

    public boolean updateUserAchievement(User user) {
        String sql = "UPDATE Users SET user_achievement = ? WHERE user_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getUserAchievement());  // 假设 User 类有 getUserAchievement 方法
            pstmt.setInt(2, user.getUserId());

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0; // 如果更新成功，返回 true

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false; // 如果更新失败，返回 false
    }

    public static void main(String[] args) {
        UserGameDAO userGameDAO = new UserGameDAO();

        String s=getUserAchievements(1);
        System.out.println(s);

        userGameDAO.handleUserGameClick(1, 3, "贪吃蛇");

        System.out.println("Test complete.");
    }
}
