<script lang="ts">
	import { profile } from '$lib/store';
	
	let isEditing = $state(false);
	let editName = $state($profile.name);
	
	function saveProfile() {
		if (editName.trim()) {
			$profile.name = editName.trim();
			isEditing = false;
		}
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') saveProfile();
		if (e.key === 'Escape') {
			editName = $profile.name;
			isEditing = false;
		}
	}
</script>

<svelte:head>
	<title>Profile - Antigravity</title>
</svelte:head>

<div class="flex flex-col items-center justify-center p-10 bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full max-w-md mx-4 relative overflow-hidden mt-16">
	<!-- Decorative background blob -->
	<div class="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40"></div>
	<div class="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-[80px] opacity-30"></div>
	
	<h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-8 relative z-10 tracking-wide">PLAYER PROFILE</h1>
	
	<div class="w-full space-y-6 relative z-10">
		<div class="bg-white/10 p-6 rounded-3xl border border-white/10 shadow-inner backdrop-blur-sm">
			<label class="block text-xs font-bold text-gray-300 mb-3 uppercase tracking-[0.2em]" for="playerName">
				Display Name
			</label>
			
			{#if isEditing}
				<div class="flex flex-col gap-3">
					<input 
						id="playerName"
						type="text" 
						bind:value={editName}
						onkeydown={handleKeydown}
						class="w-full bg-black/40 border-2 border-purple-500/50 rounded-2xl px-5 py-4 text-white text-lg font-bold focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all shadow-inner"
						placeholder="Enter your name"
						maxlength="15"
					/>
					<button 
						onclick={saveProfile}
						class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-black text-lg transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-[1.02]"
					>
						SAVE PROFILE
					</button>
				</div>
			{:else}
				<div class="flex justify-between items-center bg-black/30 rounded-2xl px-5 py-4 border border-white/5 shadow-inner">
					<span class="text-2xl font-black text-purple-300 drop-shadow-sm">{ $profile.name }</span>
					<button 
						onclick={() => { editName = $profile.name; isEditing = true; }}
						class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 border border-white/10"
					>
						EDIT
					</button>
				</div>
			{/if}
		</div>
		
		<div class="bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-8 rounded-3xl border border-white/10 text-center shadow-inner relative overflow-hidden">
			<h2 class="text-xs font-bold text-gray-300 mb-2 uppercase tracking-[0.2em] relative z-10">Personal Best</h2>
			<div class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-purple-200 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] relative z-10 mt-2">
				{ $profile.bestScore }
			</div>
		</div>
	</div>
</div>
