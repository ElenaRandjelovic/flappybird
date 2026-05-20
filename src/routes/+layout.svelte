<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 overflow-hidden relative">
	<!-- Navigation Header (Hidden on Game Route) -->
	{#if $page.url.pathname !== '/game'}
		<header class="absolute top-6 left-1/2 -translate-x-1/2 z-50">
			<nav class="flex items-center gap-2 md:gap-6 bg-white/10 backdrop-blur-xl px-6 py-3 md:px-8 md:py-4 rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
				<a href="/" class="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-wider hover:scale-105 transition-transform mr-4 md:mr-8">
					ANTIGRAVITY
				</a>
				<a href="/profile" class="text-sm md:text-base font-bold text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full {$page.url.pathname === '/profile' ? 'bg-white/20 text-white shadow-inner' : 'hover:bg-white/10'}">Profile</a>
				<a href="/leaderboard" class="text-sm md:text-base font-bold text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full {$page.url.pathname === '/leaderboard' ? 'bg-white/20 text-white shadow-inner' : 'hover:bg-white/10'}">Leaderboard</a>
			</nav>
		</header>
	{/if}

	<main class="w-full flex-1 flex flex-col items-center justify-center">
		{@render children()}
	</main>
</div>
