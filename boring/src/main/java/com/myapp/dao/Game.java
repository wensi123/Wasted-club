package com.myapp.dao;

public class Game {
    private int gameId;
    private String gameName;
    private String description;
    private String icon;

    // 默认构造函数
    public Game() {
    }

    // 带参构造函数，用于快速创建对象
    public Game(int gameId, String gameName, String description, String icon) {
        this.gameId = gameId;
        this.gameName = gameName;
        this.description = description;
        this.icon = icon;
    }

    // 获取 gameId
    public int getGameId() {
        return gameId;
    }

    // 设置 gameId
    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    // 获取 gameName
    public String getGameName() {
        return gameName;
    }

    // 设置 gameName
    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    // 获取 description
    public String getDescription() {
        return description;
    }

    // 设置 description
    public void setDescription(String description) {
        this.description = description;
    }

    // 获取 icon
    public String getIcon() {
        return icon;
    }

    // 设置 icon
    public void setIcon(String icon) {
        this.icon = icon;
    }

    // 重写 toString 方法，用于输出 Game 对象的信息
    @Override
    public String toString() {
        return "Game{" +
                "gameId=" + gameId +
                ", gameName='" + gameName + '\'' +
                ", description='" + description + '\'' +
                ", icon='" + icon + '\'' +
                '}';
    }
}
