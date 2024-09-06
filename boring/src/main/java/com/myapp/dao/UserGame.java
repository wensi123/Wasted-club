package com.myapp.dao;

public class UserGame {

    private int id; // 用户游戏记录的唯一标识
    private int userId; // 用户的唯一标识
    private int gameId; // 游戏的唯一标识
    private String achievements; // 用户在游戏中的成就

    // 无参构造方法
    public UserGame() {
    }

    // 带参数的构造方法
    public UserGame(int id, int userId, int gameId, String achievements) {
        this.id = id;
        this.userId = userId;
        this.gameId = gameId;
        this.achievements = achievements;
    }

    // Getter 和 Setter 方法

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getGameId() {
        return gameId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    public String getAchievements() {
        return achievements;
    }

    public void setAchievements(String achievements) {
        this.achievements = achievements;
    }

    // 可选：重写toString()方法，用于调试或日志记录
    @Override
    public String toString() {
        return "UserGame{" +
                "id=" + id +
                ", userId=" + userId +
                ", gameId=" + gameId +
                ", achievements='" + achievements + '\'' +
                '}';
    }
}
