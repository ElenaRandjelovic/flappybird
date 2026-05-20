<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { profile, updateLeaderboardIfHighscore } from '$lib/store';

	let canvas: HTMLCanvasElement;
	let canvasContainer: HTMLDivElement;
	let ctx: CanvasRenderingContext2D | null;
	let animationFrameId: number;

	// Game state
	let gameState: 'START' | 'PLAYING' | 'GAMEOVER' = $state('START');
	let score = $state(0);
	let finalScore = $state(0);
	let lastTime = 0;

	// Physics constants
	const GRAVITY_MAGNITUDE = 1200; // pixels per second squared
	const JUMP_VELOCITY = 0; // We don't jump, we just flip gravity
	const OBSTACLE_SPEED = 300; // pixels per second
	const OBSTACLE_SPAWN_RATE = 1500; // ms
	const PIPE_WIDTH = 60;
	const GAP_SIZE = 180;

	// Player
	let player = {
		x: 100,
		y: 300,
		width: 30,
		height: 30,
		velocity: 0,
		gravityDir: 1 // 1 for down, -1 for up
	};

	// Obstacles
	type Pipe = { x: number; topHeight: number; bottomY: number; passed: boolean };
	let pipes: Pipe[] = [];
	let lastSpawnTime = 0;

	function initGame() {
		if (!canvas) return;
		ctx = canvas.getContext('2d');
		
		// Set canvas size to window inner sizes or a fixed aspect ratio
		resizeCanvas();
		
		resetGame();
		
		// Handle resize
		window.addEventListener('resize', resizeCanvas);
	}

	function resizeCanvas() {
		if (!canvas || !canvasContainer) return;
		// Keep it responsive but bounded
		canvas.width = canvasContainer.clientWidth;
		canvas.height = canvasContainer.clientHeight;
	}

	function resetGame() {
		player.y = canvas.height / 2;
		player.velocity = 0;
		player.gravityDir = 1;
		pipes = [];
		score = 0;
		lastTime = performance.now();
		lastSpawnTime = lastTime;
	}

	function startGame() {
		gameState = 'PLAYING';
		resetGame();
		gameLoop(performance.now());
	}

	function setGravity(dir: -1 | 1) {
		if (gameState === 'PLAYING') {
			if (player.gravityDir !== dir) {
				player.gravityDir = dir;
				player.velocity = 0;
			}
		} else if (gameState === 'START' || gameState === 'GAMEOVER') {
			if (dir === -1) startGame();
		}
	}



	function spawnPipe() {
		const minHeight = 50;
		const maxHeight = canvas.height - GAP_SIZE - minHeight;
		const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
		
		pipes.push({
			x: canvas.width,
			topHeight: topHeight,
			bottomY: topHeight + GAP_SIZE,
			passed: false
		});
	}

	function update(dt: number) {
		// Update player physics
		// Velocity = initial_velocity + acceleration * time
		player.velocity += (GRAVITY_MAGNITUDE * player.gravityDir) * dt;
		// Position = initial_pos + velocity * time
		player.y += player.velocity * dt;

		// Floor/Ceiling collision
		if (player.y < 0) {
			player.y = 0;
			gameOver();
		} else if (player.y + player.height > canvas.height) {
			player.y = canvas.height - player.height;
			gameOver();
		}

		// Update pipes
		for (let i = pipes.length - 1; i >= 0; i--) {
			const pipe = pipes[i];
			pipe.x -= OBSTACLE_SPEED * dt;

			// Collision detection
			if (
				player.x < pipe.x + PIPE_WIDTH &&
				player.x + player.width > pipe.x &&
				(player.y < pipe.topHeight || player.y + player.height > pipe.bottomY)
			) {
				gameOver();
			}

			// Score update
			if (!pipe.passed && player.x > pipe.x + PIPE_WIDTH) {
				pipe.passed = true;
				score++;
			}

			// Remove off-screen pipes
			if (pipe.x + PIPE_WIDTH < 0) {
				pipes.splice(i, 1);
			}
		}

		// Spawn new pipes
		if (performance.now() - lastSpawnTime > OBSTACLE_SPAWN_RATE) {
			spawnPipe();
			lastSpawnTime = performance.now();
		}
	}

	function draw() {
		if (!ctx || !canvas) return;
		const c = ctx;

		// Clear canvas
		c.clearRect(0, 0, canvas.width, canvas.height);

		// Draw Player (with slight rotation based on velocity)
		c.save();
		c.translate(player.x + player.width / 2, player.y + player.height / 2);
		
		// Tilt up or down depending on gravity and velocity
		let angle = (player.velocity / 1000) * (Math.PI / 4); 
		// Limit angle
		angle = Math.max(-Math.PI/3, Math.min(Math.PI/3, angle));
		c.rotate(angle);

		// Draw Bird Body (ellipse)
		c.fillStyle = '#fbbf24'; // yellow-400
		c.beginPath();
		c.ellipse(0, 0, player.width / 2 + 5, player.height / 2, 0, 0, Math.PI * 2);
		c.fill();
		
		// Bird Belly
		c.fillStyle = '#fef3c7'; // yellow-50
		c.beginPath();
		c.ellipse(0, player.height / 4, player.width / 2, player.height / 4, 0, 0, Math.PI * 2);
		c.fill();

		// Bird Wing
		c.fillStyle = '#f59e0b'; // amber-500
		c.beginPath();
		// If gravity is UP (-1), wing points down; if DOWN (1), wing points up. Or animate based on time.
		const wingAngle = player.gravityDir === -1 ? Math.PI / 4 : -Math.PI / 4;
		c.ellipse(-player.width / 6, 0, player.width / 3, player.height / 5, wingAngle, 0, Math.PI * 2);
		c.fill();

		// Beak
		c.fillStyle = '#ea580c'; // orange-600
		c.beginPath();
		c.moveTo(player.width / 2, -player.height / 6);
		c.lineTo(player.width / 2 + 15, 0);
		c.lineTo(player.width / 2, player.height / 6);
		c.closePath();
		c.fill();

		// Eye
		c.fillStyle = 'white';
		c.beginPath();
		c.arc(player.width / 4, -player.height / 4, 6, 0, Math.PI * 2);
		c.fill();
		c.fillStyle = 'black';
		c.beginPath();
		c.arc(player.width / 4 + 2, -player.height / 4, 2.5, 0, Math.PI * 2);
		c.fill();

		c.restore();

		// Draw Pipes
		pipes.forEach(pipe => {
			// Top pipe
			const pipeGradient = c.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
			pipeGradient.addColorStop(0, '#10b981'); // emerald-500
			pipeGradient.addColorStop(1, '#059669'); // emerald-600

			c.fillStyle = pipeGradient;
			
			// Top pipe body
			c.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
			// Top pipe cap
			c.fillStyle = '#047857'; // emerald-700
			c.fillRect(pipe.x - 4, pipe.topHeight - 20, PIPE_WIDTH + 8, 20);

			// Bottom pipe body
			c.fillStyle = pipeGradient;
			c.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);
			// Bottom pipe cap
			c.fillStyle = '#047857';
			c.fillRect(pipe.x - 4, pipe.bottomY, PIPE_WIDTH + 8, 20);
		});

		// Particles or trail could be added here for extra juice
	}

	function gameLoop(timestamp: number) {
		if (gameState !== 'PLAYING') return;

		const dt = (timestamp - lastTime) / 1000; // Delta time in seconds
		lastTime = timestamp;

		// Cap dt to prevent huge jumps if tab is inactive
		if (dt < 0.1) {
			update(dt);
		}
		draw();

		if (gameState === 'PLAYING') {
			animationFrameId = requestAnimationFrame(gameLoop);
		}
	}

	function gameOver() {
		gameState = 'GAMEOVER';
		finalScore = score;
		
		// Update profile score
		if (finalScore > $profile.bestScore) {
			$profile.bestScore = finalScore;
		}
		
		// Update leaderboard
		updateLeaderboardIfHighscore($profile.name, finalScore);
	}

	function handleInputDown(e: KeyboardEvent | MouseEvent | TouchEvent) {
		// Prevent default scrolling for spacebar and arrow keys
		if (e instanceof KeyboardEvent) {
			if (e.code === 'Space' || e.code === 'ArrowUp') {
				e.preventDefault();
				if (!e.repeat) setGravity(-1);
			} else if (e.code === 'ArrowDown') {
				e.preventDefault();
				if (!e.repeat) setGravity(1);
			}
		} else if (e.type === 'mousedown' || e.type === 'touchstart') {
			e.preventDefault();
			setGravity(-1);
		}
	}

	function handleInputUp(e: KeyboardEvent | MouseEvent | TouchEvent) {
		if (e instanceof KeyboardEvent) {
			if (e.code === 'Space' || e.code === 'ArrowUp') {
				e.preventDefault();
				setGravity(1); // Default fall down
			}
		} else if (e.type === 'mouseup' || e.type === 'touchend') {
			e.preventDefault();
			setGravity(1);
		}
	}

	onMount(() => {
		initGame();
		
		// Initial draw
		draw();

		window.addEventListener('keydown', handleInputDown as EventListener, { passive: false });
		window.addEventListener('keyup', handleInputUp as EventListener, { passive: false });
		// Event listeners for canvas are bound directly in template
	});

	onDestroy(() => {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
		}
		if (browser) {
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('keydown', handleInputDown as EventListener);
			window.removeEventListener('keyup', handleInputUp as EventListener);
		}
	});
	
	// Ensure this runs only in browser
	import { browser } from '$app/environment';
</script>

<svelte:head>
	<title>Play - Antigravity Flappy</title>
</svelte:head>

<!-- Full screen game container -->
<div class="fixed inset-0 w-full h-full bg-slate-900 overflow-hidden select-none touch-none">
	<!-- Canvas -->
	<div class="absolute inset-0 w-full h-full" bind:this={canvasContainer}>
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<canvas 
			bind:this={canvas} 
			class="w-full h-full cursor-crosshair"
			onmousedown={handleInputDown as any}
			ontouchstart={handleInputDown as any}
			onmouseup={handleInputUp as any}
			ontouchend={handleInputUp as any}
		></canvas>
	</div>

	<!-- UI Overlay -->
	<div class="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
		<!-- Top Bar -->
		<div class="flex justify-between items-start z-10">
			<div class="bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-lg">
				<span class="text-gray-400 text-sm font-bold uppercase tracking-wider mr-2">Score</span>
				<span class="text-4xl font-extrabold text-white">{score}</span>
			</div>

			<button 
				class="pointer-events-auto bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 text-red-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
				onclick={() => {
					if (gameState === 'PLAYING') gameOver();
					goto('/');
				}}
			>
				Give Up
			</button>
		</div>

		<!-- Start / Game Over Overlays -->
		<div class="flex-1 flex items-center justify-center pointer-events-none">
			{#if gameState === 'START'}
				<div class="bg-black/60 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center animate-pulse shadow-2xl">
					<h2 class="text-3xl font-bold text-white mb-2">Ready?</h2>
					<p class="text-gray-300 text-lg">Use <span class="text-purple-400 font-bold">↑ / ↓ Arrows</span> to steer!</p>
				</div>
			{/if}

			{#if gameState === 'GAMEOVER'}
				<div class="pointer-events-auto bg-black/80 backdrop-blur-xl p-10 rounded-3xl border border-white/20 text-center shadow-[0_0_50px_rgba(244,63,94,0.3)] animate-in fade-in zoom-in duration-300">
					<h2 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600 mb-6 drop-shadow-sm">
						GAME OVER
					</h2>
					
					<div class="grid grid-cols-2 gap-4 mb-8">
						<div class="bg-white/5 p-4 rounded-2xl">
							<p class="text-gray-400 text-sm mb-1 uppercase tracking-wider">Score</p>
							<p class="text-4xl font-bold text-white">{finalScore}</p>
						</div>
						<div class="bg-white/5 p-4 rounded-2xl">
							<p class="text-gray-400 text-sm mb-1 uppercase tracking-wider">Best</p>
							<p class="text-4xl font-bold text-purple-400">{$profile.bestScore}</p>
						</div>
					</div>

					<div class="flex flex-col gap-3">
						<button 
							class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-xl transition-all hover:scale-105 shadow-lg"
							onclick={startGame}
						>
							PLAY AGAIN
						</button>
						<button 
							class="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
							onclick={() => goto('/')}
						>
							Main Menu
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
