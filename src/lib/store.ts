import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Default values
const defaultProfile = {
	name: 'Player 1',
	bestScore: 0
};

const defaultLeaderboard = [
	{ name: 'Gravity Master', score: 50 },
	{ name: 'Floaty', score: 30 },
	{ name: 'Noob', score: 10 }
];

// Initialize from localStorage if available
const initialProfile = browser 
	? JSON.parse(localStorage.getItem('antigravity_profile') || JSON.stringify(defaultProfile))
	: defaultProfile;

const initialLeaderboard = browser
	? JSON.parse(localStorage.getItem('antigravity_leaderboard') || JSON.stringify(defaultLeaderboard))
	: defaultLeaderboard;

// Create stores
export const profile = writable(initialProfile);
export const leaderboard = writable(initialLeaderboard);

// Subscribe to changes and save to localStorage
if (browser) {
	profile.subscribe(value => {
		localStorage.setItem('antigravity_profile', JSON.stringify(value));
	});

	leaderboard.subscribe(value => {
		localStorage.setItem('antigravity_leaderboard', JSON.stringify(value));
	});
}

type LeaderboardEntry = { name: string; score: number };

// Helper to update leaderboard with new score
export function updateLeaderboardIfHighscore(name: string, score: number) {
	leaderboard.update((board: LeaderboardEntry[]) => {
		const newEntry = { name, score };
		// Check if player already exists in leaderboard
		const existingIndex = board.findIndex(entry => entry.name === name);
		
		if (existingIndex !== -1) {
			if (score > board[existingIndex].score) {
				board[existingIndex].score = score;
			}
		} else {
			board.push(newEntry);
		}
		
		// Sort descending and keep top 10
		return board.sort((a, b) => b.score - a.score).slice(0, 10);
	});
}
