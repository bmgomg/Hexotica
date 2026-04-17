<script>
	import { fade } from 'svelte/transition';
	import Board from './Board.svelte';
	import Decks from './Decks.svelte';
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
	import Menu from './Menu.svelte';
	import Rules from './Rules.svelte';
	import { ss } from './shared.svelte';
	import Tutorial from './Tutorial/• Tutorial.svelte';
	import { underMouse } from './utils';

	const onClick = (e) => {
		if (underMouse(e, ['#menu', '#decks', '#ruels', '#tutorial'])) {
			e.stopPropagation();
			return;
		}

		if (ss.rules || ss.tutorial) {
			e.stopPropagation();
			return;
		}

		if (ss.menu && ss.tiles.some((t) => t.place)) {
			delete ss.menu;
		} else if (ss.decks) {
			delete ss.decks;
		}
	};
</script>

<div class="game-page" onpointerdown={onClick} in:fade>
	<Header />
	<Board />
	<Menu />
	<Rules />
	<Tutorial />
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
