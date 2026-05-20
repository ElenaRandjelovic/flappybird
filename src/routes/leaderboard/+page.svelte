<script lang="ts">
	import { leaderboard, profile } from '$lib/store';
</script>

<svelte:head>
	<title>Leaderboard - Antigravity</title>
</svelte:head>

<div class="flex flex-col items-center justify-center p-10 bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full max-w-md mx-4 relative overflow-hidden mt-16">
	<!-- Decorative background blobs -->
	<div class="absolute -top-20 -left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>
	<div class="absolute bottom-10 -right-10 w-48 h-48 bg-purple-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>

	<h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-8 relative z-10 flex items-center gap-4 tracking-wide">
		<span class="text-4xl drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">🏆</span> GLOBAL TOP 10
	</h1>
	
	<div class="w-full relative z-10">
		<div class="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 space-y-3">
			{#if $leaderboard.length === 0}
				<div class="p-8 text-center text-gray-400 font-bold bg-white/5 rounded-2xl border border-white/10">
					No scores yet. Be the first!
				</div>
			{:else}
				<ul class="space-y-3">
					{#each $leaderboard as entry, index}
						<li class="flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] shadow-lg
							{entry.name === $profile.name 
								? 'bg-gradient-to-r from-purple-600/60 to-pink-600/60 border-pink-400/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
								: 'bg-white/10 border-white/10 hover:bg-white/20'}">
							<div class="flex items-center gap-4">
								<div class="flex items-center justify-center w-10 h-10 rounded-full bg-black/30 border border-white/10 shadow-inner font-black
									{index === 0 ? 'text-yellow-400 text-2xl shadow-[0_0_10px_rgba(250,204,21,0.3)]' : ''}
									{index === 1 ? 'text-gray-300 text-xl' : ''}
									{index === 2 ? 'text-amber-600 text-xl' : ''}
									{index > 2 ? 'text-gray-500' : ''}
								">
									{#if index === 0}1
									{:else if index === 1}2
									{:else if index === 2}3
									{:else}{index + 1}{/if}
								</div>
								<span class="font-black tracking-wide {entry.name === $profile.name ? 'text-white' : 'text-gray-200'} text-lg truncate max-w-[150px]">
									{entry.name}
								</span>
							</div>
							<div class="bg-black/30 px-4 py-1.5 rounded-full border border-white/5">
								<span class="font-mono text-xl font-black {entry.name === $profile.name ? 'text-pink-300' : 'text-purple-300'}">
									{entry.score}
								</span>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar for webkit */
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.05);
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(168, 85, 247, 0.5); /* purple-500 with opacity */
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(168, 85, 247, 0.8);
	}
</style>
