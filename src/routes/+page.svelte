<script lang="ts">
	import { profile } from '$lib/store';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	let birds = $state<{
		id: number,
		top: number,
		left: number,
		size: number,
		delay: number,
		duration: number,
		direction: number,
		colorBody: string,
		colorBelly: string,
		colorWing: string
	}[]>([]);

	const colors = [
		{ body: '#fbbf24', belly: '#fef3c7', wing: '#f59e0b' }, // Yellow
		{ body: '#f43f5e', belly: '#ffe4e6', wing: '#e11d48' }, // Pink
		{ body: '#3b82f6', belly: '#dbeafe', wing: '#2563eb' }, // Blue
		{ body: '#10b981', belly: '#d1fae5', wing: '#059669' }, // Green
		{ body: '#a855f7', belly: '#f3e8ff', wing: '#9333ea' }, // Purple
	];

	onMount(() => {
		const newBirds = [];
		for (let i = 0; i < 35; i++) {
			const color = colors[Math.floor(Math.random() * colors.length)];
			newBirds.push({
				id: i,
				top: Math.random() * 100,
				left: Math.random() * 100,
				size: 30 + Math.random() * 60, // size between 30px and 90px
				delay: Math.random() * 5,
				duration: 3 + Math.random() * 6,
				direction: Math.random() > 0.5 ? 1 : -1,
				colorBody: color.body,
				colorBelly: color.belly,
				colorWing: color.wing
			});
		}
		birds = newBirds;
	});
</script>

<svelte:head>
	<title>Antigravity Flappy Bird v2 🐦</title>
</svelte:head>

<!-- Decorative Background Birds -->
<div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
	{#each birds as bird (bird.id)}
		<svg 
			class="absolute opacity-30 floating-bird" 
			style="
				top: {bird.top}%; 
				left: {bird.left}%; 
				width: {bird.size}px; 
				height: {bird.size}px;
				animation-duration: {bird.duration}s; 
				animation-delay: {bird.delay}s;
				transform: scaleX({bird.direction});
			" 
			viewBox="0 0 100 100"
		>
			<ellipse cx="50" cy="50" rx="30" ry="25" fill={bird.colorBody} />
			<ellipse cx="50" cy="55" rx="25" ry="15" fill={bird.colorBelly} />
			<ellipse cx="35" cy="50" rx="15" ry="10" fill={bird.colorWing} transform="rotate(-20 35 50)" />
			<path d="M 65 45 L 85 55 L 65 55 Z" fill="#ea580c" />
			<circle cx="60" cy="40" r="5" fill="white" />
			<circle cx="62" cy="40" r="2" fill="black" />
		</svg>
	{/each}
</div>

<div class="flex flex-col items-center justify-center p-10 bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full max-w-md mx-4 relative z-10">
	<div class="mb-10 text-center relative">
		<h1 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 mb-2 drop-shadow-[0_0_15px_rgba(192,132,252,0.6)]">
			ANTIGRAVITY
		</h1>
		<h2 class="text-3xl font-extrabold text-white tracking-[0.2em] drop-shadow-md opacity-90">
			FLAPPYBIRD
		</h2>
	</div>
	
	<div class="mb-8 text-center bg-white/10 p-5 rounded-2xl border border-white/10 w-full shadow-inner backdrop-blur-sm">
		<p class="text-gray-300 text-xs font-bold uppercase tracking-[0.15em] mb-1">Welcome back,</p>
		<p class="text-2xl font-black text-purple-300 drop-shadow-sm">{$profile.name}</p>
		<div class="mt-4 pt-4 border-t border-white/10">
			<p class="text-sm font-semibold text-gray-400">BEST SCORE: <span class="score-glow text-white text-xl font-black ml-2">{$profile.bestScore}</span></p>
		</div>
	</div>

	<a 
		href="{base}/game" 
		class="group relative inline-flex items-center justify-center px-10 py-5 font-black text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-500 hover:to-pink-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] focus:outline-none focus:ring-4 focus:ring-pink-500/50 w-full text-xl"
	>
		START GAME
	</a>
	
	<div class="mt-8 text-sm font-semibold text-gray-300 text-center bg-black/30 py-3 px-6 rounded-full border border-white/5">
		<p>Steer with <kbd class="px-2 py-1 bg-gray-800 rounded-md text-pink-400 font-bold border border-gray-700 mx-1">↑</kbd> and <kbd class="px-2 py-1 bg-gray-800 rounded-md text-pink-400 font-bold border border-gray-700 mx-1">↓</kbd> or <kbd class="px-2 py-1 bg-gray-800 rounded-md text-pink-400 font-bold border border-gray-700 mx-1">Space</kbd></p>
	</div>

	<div class="mt-6 text-xs text-gray-400 text-center hover:text-white transition-colors duration-200">
		<a href="https://github.com/ElenaRandjelovic/flappybird" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 focus:outline-none focus:underline">
			<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
			</svg>
			View on GitHub
		</a>
	</div>
</div>

<style>
	@keyframes float {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-20px);
		}
	}
	.floating-bird {
		animation: float 4s ease-in-out infinite;
	}

	@keyframes glow-pulse {
		0%, 100% { text-shadow: 0 0 8px rgba(192, 132, 252, 0.8); }
		50% { text-shadow: 0 0 20px rgba(236, 72, 153, 1), 0 0 40px rgba(192, 132, 252, 0.6); }
	}
	.score-glow {
		animation: glow-pulse 2s ease-in-out infinite;
	}
</style>
