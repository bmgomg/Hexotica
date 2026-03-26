<script>
	import { fade } from 'svelte/transition';
	import Board from './Board.svelte';
</script>

<div class="game-page" in:fade>
    <Board/>
</div>

<style>
	.game-page {
		touch-action: none;
		box-sizing: border-box;
		display: grid;
		grid: 80px 1fr 60px / auto;
		overflow: hidden;
	}
</style>
