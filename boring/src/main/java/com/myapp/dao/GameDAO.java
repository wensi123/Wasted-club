package com.myapp.dao;

import com.myapp.dao.DatabaseConnection;
import com.myapp.dao.Game;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class GameDAO {

    // 获取用户已发现的游戏列表
    public List<Game> getGamesDiscoveredByUser(int userId) {
        List<Game> games = new ArrayList<>();
        String sql = "SELECT g.game_id, g.game_name, g.description, g.icon " +
                "FROM Games g JOIN UserGames ug ON g.game_id = ug.game_id " +
                "WHERE ug.user_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                Game game = new Game();
                game.setGameId(rs.getInt("game_id"));
                game.setGameName(rs.getString("game_name"));
                game.setDescription(rs.getString("description"));

                game.setIcon(rs.getString("icon"));
                games.add(game);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return games;
    }

    // 获取指定游戏 ID 的游戏信息
    public Game getGameById(int gameId) {
        Game game = null;
        String sql = "SELECT * FROM Games WHERE game_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, gameId);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                game = new Game();
                game.setGameId(rs.getInt("game_id"));
                game.setGameName(rs.getString("game_name"));
                game.setDescription(rs.getString("description"));
                game.setIcon(rs.getString("icon"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return game;
    }

    // 获取指定游戏 ID 的游戏名称
    public String getGameName(int gameId) {
        String gameName = null;
        String sql = "SELECT game_name FROM Games WHERE game_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, gameId);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                gameName = rs.getString("game_name");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return gameName;
    }
}
