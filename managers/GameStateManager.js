/**
 * GameStateManager 类 - 游戏状态管理器
 */
class GameStateManager {
    static musicEnabled = true;  // 音乐开关状态

    static toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        return this.musicEnabled;
    }

    static isMusicEnabled() {
        return this.musicEnabled;
    }
} 