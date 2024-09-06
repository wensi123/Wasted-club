package com.myapp.dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import org.mindrot.jbcrypt.BCrypt;

public class UserDAO {

    // 登录界面
    public boolean register(String username, String email, String password) {
        String checkSql = "SELECT COUNT(*) FROM Users WHERE username = ? OR email = ?";
        String insertSql = "INSERT INTO Users (username, password, email) VALUES (?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement checkStmt = conn.prepareStatement(checkSql)) {

            // 检查用户名或邮箱是否已存在
            checkStmt.setString(1, username);
            checkStmt.setString(2, email);
            ResultSet rs = checkStmt.executeQuery();

            if (rs.next() && rs.getInt(1) > 0) {
                // 用户名或邮箱已存在
                System.out.println("用户名或邮箱已存在，请修改!");
                return false;
            }
            // 使用 BCrypt 对密码进行加密
            String salt = BCrypt.gensalt();
            String hashedPassword = BCrypt.hashpw(password,salt);

            // 插入新用户
            try (PreparedStatement insertStmt = conn.prepareStatement(insertSql)) {
                insertStmt.setString(1, username);
                insertStmt.setString(2, hashedPassword);
                insertStmt.setString(3, email);
                int rowsAffected = insertStmt.executeUpdate();
                if (rowsAffected > 0) {
                    System.out.println("注册成功，用户名为: " + username);
                    return true;
                } else {
                    System.out.println("注册失败，用户名为: " + username);
                    return false;
                }

            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // 读取所有用户
    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        String sql = "SELECT * FROM Users";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                User user = new User();
                user.setUserId(rs.getInt("user_id"));
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setEmail(rs.getString("email"));
                user.setProfilePicture(rs.getString("profile_picture"));
                user.setBio(rs.getString("bio"));
                user.setOnlineTime(rs.getInt("online_time"));
                user.setNumberOfVoyages(rs.getInt("number_of_voyages"));
                users.add(user);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return users;
    }

    // 更新用户
    public boolean updateUser(User user) {
        String sql = "UPDATE Users SET username = ?, password = ?, email = ?, profile_picture = ?, bio = ?, online_time = ?, number_of_voyages = ? WHERE user_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, user.getUsername() != null ? user.getUsername() : "defaultUsername");
            pstmt.setString(2, user.getPassword() != null ? user.getPassword() : "defaultPassword");
            pstmt.setString(3, user.getEmail() != null ? user.getEmail() : "defaultEmail@example.com");
            pstmt.setString(4, user.getProfilePicture());
            pstmt.setString(5, user.getBio());
            pstmt.setInt(6, user.getOnlineTime());
            pstmt.setInt(7, user.getNumberOfVoyages());
            pstmt.setInt(8, user.getUserId());

            int rowsAffected = pstmt.executeUpdate();

            return rowsAffected > 0;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // 删除用户
    public void deleteUser(int userId) {
        String sql = "DELETE FROM Users WHERE user_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            pstmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    //登录
    public User login(String email, String password) {
        String sql = "SELECT * FROM Users WHERE email = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                String hashpw = rs.getString("password");
                boolean checkpw = BCrypt.checkpw(password, hashpw);
                System.out.println("存储的密码为："+hashpw);

                // 比较输入的密码与存储的密码
                if (checkpw) {
                    // 登录成功，将用户信息存储到会话中
                    User user = new User();
                    user.setUserId(rs.getInt("user_id"));
                    user.setUsername(rs.getString("username"));
                    user.setEmail(rs.getString("email"));
                    user.setBio(rs.getString("bio"));
                    user.setNumberOfVoyages(rs.getInt("Number_Of_Voyages"));
                    user.setOnlineTime(rs.getInt("Online_Time"));
                    user.setProfilePicture(rs.getString("Profile_Picture"));

                    return user;
                }
            }

        } catch (SQLException e) {
            System.out.println("SQL出现错误, " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    // 校验密保问题答案的方法
    public boolean getSecurityAnswer(String email, String answer) {
        User user = getUserByEmail(email); // 获取用户对象
        if (user != null) {
            String storedAnswer = user.getAnswer(); // 获取数据库中的答案
            System.out.println("保存："+storedAnswer);
            System.out.println("输入："+answer);
            if(storedAnswer.equals(answer)){
                return true;
            }
            /*return storedAnswer != null && storedAnswer.equals(answer); // 比较答案*/
        }
        return false; // 用户未找到或答案不匹配
    }

    //通过邮箱获取用户信息，密保问题回答正确后直接登录
    public User getUserByEmail(String email) {
        String sql = "SELECT * FROM Users WHERE email = ?"; // SQL查询语句，使用email作为参数
        try (Connection conn = DatabaseConnection.getConnection(); // 从数据库连接池获取连接
             PreparedStatement pstmt = conn.prepareStatement(sql)) { // 创建PreparedStatement对象

            pstmt.setString(1, email); // 设置查询参数为email
            ResultSet rs = pstmt.executeQuery(); // 执行查询并返回结果集

            if (rs.next()) { // 如果结果集非空
                User user = new User(); // 创建User对象
                user.setUserId(rs.getInt("user_id")); // 设置User对象的userId属性
                user.setUsername(rs.getString("username")); // 设置User对象的username属性
                user.setPassword(rs.getString("password")); // 设置User对象的password属性
                user.setEmail(rs.getString("email")); // 设置User对象的email属性
                user.setProfilePicture(rs.getString("profile_picture")); // 设置User对象的profilePicture属性
                user.setBio(rs.getString("bio")); // 设置User对象的bio属性
                user.setOnlineTime(rs.getInt("online_time")); // 设置User对象的onlineTime属性
                user.setNumberOfVoyages(rs.getInt("number_of_voyages")); // 设置User对象的numberOfVoyages属性
                user.setAnswer(rs.getString("answer"));
                return user; // 返回User对象
            }

        } catch (SQLException e) { // 捕获SQL异常
            e.printStackTrace(); // 打印异常堆栈跟踪
        }
        return null; // 如果用户未找到，返回null
    }

    // 更新用户在线时长
    public boolean updateOnlineTime(int userId, long onlineTime) {
        String updateSql = "UPDATE Users SET online_time = online_time + ? WHERE user_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(updateSql)) {

            stmt.setLong(1, onlineTime);
            stmt.setInt(2, userId);

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
    // 获取用户总在线时长的排名
    public List<User> getUsersByOnlineTime() {
        List<User> users = new ArrayList<>();
        String sql = "SELECT user_id, username, online_time,profile_picture FROM Users ORDER BY online_time DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                User user = new User();
                user.setUserId(rs.getInt("user_id"));
                user.setUsername(rs.getString("username"));
                user.setOnlineTime(rs.getInt("online_time"));
                user.setProfilePicture(rs.getString("profile_picture"));
                users.add(user);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return users;
    }

    public User getUserById(int userId) {
        String sql = "SELECT * FROM Users WHERE user_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                User user = new User();
                user.setUserId(rs.getInt("user_id"));
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setEmail(rs.getString("email"));
                user.setProfilePicture(rs.getString("profile_picture"));
                user.setBio(rs.getString("bio"));
                user.setOnlineTime(rs.getInt("online_time"));
                user.setNumberOfVoyages(rs.getInt("number_of_voyages"));
                return user;
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null; // 用户未找到
    }

    // 保存用户游戏信息到 usergame 表中


//

    public static void main(String[] args) {
        UserDAO userDAO = new UserDAO();

        // 获取所有用户
        List<User> users = userDAO.getUsersByOnlineTime();
        for (User u : users) {
            System.out.println(u.getUsername());
            System.out.println(u.getOnlineTime());
        }
    }
}
