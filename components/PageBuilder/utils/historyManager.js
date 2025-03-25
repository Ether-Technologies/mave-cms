// components/PageBuilder/utils/historyManager.js

class HistoryManager {
  constructor(maxHistory = 50) {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistory = maxHistory;
  }

  // Add a new state to history
  push(state) {
    // Remove any future states if we're not at the end
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Add new state
    this.history.push(JSON.parse(JSON.stringify(state)));
    this.currentIndex++;

    // Remove oldest states if we exceed maxHistory
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  // Can we undo?
  canUndo() {
    return this.currentIndex > 0;
  }

  // Can we redo?
  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  // Get the previous state
  undo() {
    if (!this.canUndo()) return null;
    this.currentIndex--;
    return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
  }

  // Get the next state
  redo() {
    if (!this.canRedo()) return null;
    this.currentIndex++;
    return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
  }

  // Get current state
  getCurrentState() {
    if (this.currentIndex === -1) return null;
    return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
  }

  // Clear history
  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}

export default HistoryManager;
