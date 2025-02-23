/**
 * StateMachine 类 - 状态机基类
 * 
 * 功能：
 * - 管理状态转换
 * - 提供状态接口
 * 
 * @class StateMachine
 */
class StateMachine {
    constructor() {
        this.currentState = null;
    }

    // 切换到新状态
    changeState(newState) {
        if (this.currentState) {
            this.currentState.exit();
        }
        
        this.currentState = newState;
        
        if (this.currentState) {
            this.currentState.enter();
        }
    }

    // 更新当前状态
    update(input) {
        if (this.currentState) {
            // 确保传递 input 参数给当前状态的 update 方法
            this.currentState.update(input);
        }
    }

    // 获取当前状态
    getCurrentState() {
        return this.currentState;
    }
} 