<script lang="ts">
	import { profile } from '$lib/store';
	import { onMount } from 'svelte';

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
	<title>Antigravity Flappy</title>
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
			<p class="text-sm font-semibold text-gray-400">BEST SCORE: <span class="text-white text-xl font-black ml-2">{$profile.bestScore}</span></p>
		</div>
	</div>

	<a 
		href="/game" 
		class="group relative inline-flex items-center justify-center px-10 py-5 font-black text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-500 hover:to-pink-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] focus:outline-none focus:ring-4 focus:ring-pink-500/50 w-full text-xl"
	>
		START GAME
	</a>
	
	<div class="mt-8 text-sm font-semibold text-gray-300 text-center bg-black/30 py-3 px-6 rounded-full border border-white/5">
		<p>Steer with <kbd class="px-2 py-1 bg-gray-800 rounded-md text-pink-400 font-bold border border-gray-700 mx-1">↑</kbd> and <kbd class="px-2 py-1 bg-gray-800 rounded-md text-pink-400 font-bold border border-gray-700 mx-1">↓</kbd> or <kbd class="px-2 py-1 bg-gray-800 rounded-md text-pink-400 font-bold border border-gray-700 mx-1">Space</kbd></p>
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
</style>
