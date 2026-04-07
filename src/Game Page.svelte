<script>
	import { fade } from 'svelte/transition';
	import Board from './Board.svelte';
	import Menu from './Menu.svelte';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import Decks from './Decks.svelte';
</script>

<div class="game-page" in:fade>
	<Header />
	<Board />
	<Menu />
	<Decks />
	<Footer />
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
