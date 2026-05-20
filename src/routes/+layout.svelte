<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 overflow-hidden relative">
	<!-- Navigation Header (Hidden on Game Route) -->
	{#if !$page.url.pathname.includes('/game')}
		<header class="absolute top-6 left-1/2 -translate-x-1/2 z-50">
			<nav class="flex items-center gap-2 md:gap-6 bg-white/10 backdrop-blur-xl px-6 py-3 md:px-8 md:py-4 rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
				<a href="{base}/" class="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-wider hover:scale-105 transition-transform mr-4 md:mr-8">
					ANTIGRAVITY
				</a>
				<a href="{base}/profile" class="text-sm md:text-base font-bold text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full {$page.url.pathname.endsWith('/profile') || $page.url.pathname.endsWith('/profile/') ? 'bg-white/20 text-white shadow-inner' : 'hover:bg-white/10'}">Profile</a>
				<a href="{base}/leaderboard" class="text-sm md:text-base font-bold text-white/80 hover:text-white transition-colors px-4 py-2 rounded-full {$page.url.pathname.endsWith('/leaderboard') || $page.url.pathname.endsWith('/leaderboard/') ? 'bg-white/20 text-white shadow-inner' : 'hover:bg-white/10'}">Leaderboard</a>
				<a href="https://github.com/ElenaRandjelovic/flappybird" target="_blank" rel="noopener noreferrer" class="text-white/80 hover:text-white hover:scale-110 active:scale-95 transition-all p-2 rounded-full hover:bg-white/10 ml-1 flex items-center justify-center" aria-label="GitHub Repository">
					<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
					</svg>
				</a>
			</nav>
		</header>
	{/if}

	<main class="w-full flex-1 flex flex-col items-center justify-center">
		{@render children()}
	</main>
</div>
