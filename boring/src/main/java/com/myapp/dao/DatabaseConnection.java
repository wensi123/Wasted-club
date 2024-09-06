package com.myapp.dao;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Connection;


public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/game?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "123456";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");  // 显式加载JDBC驱动
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        System.out.println("Connecting to database...");
        Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
        System.out.println("Connection successful!");
        return conn;
    }
}

