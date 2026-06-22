import { useState, useCallback } from 'react';

const HISTORY_KEY = 'animeroyale_history';
const MAX_HISTORY = 10;

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load history', e);
      return [];
    }
  });

  const addHistory = useCallback((result) => {
    setHistory((prev) => {
      // Remove existing item if it has the same players and mode
      let newHistory = prev.filter(item => {
        if (item.type !== result.type) return true;
        if (item.type === 'solo') {
          return item.player.username !== result.player.username || item.platform !== result.platform || item.mediaScope !== result.mediaScope;
        }
        return (item.playerOne.username !== result.playerOne.username || item.playerTwo.username !== result.playerTwo.username) || item.platform !== result.platform || item.mediaScope !== result.mediaScope;
      });

      // Add to front
      newHistory = [result, ...newHistory].slice(0, MAX_HISTORY);

      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (e) {
        console.error('Failed to save history', e);
      }
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  }, []);

  return { history, addHistory, clearHistory };
}
