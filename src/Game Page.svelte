<script>
	import { fade } from 'svelte/transition';
	import Board from './Board.svelte';
	import Menu from './Menu.svelte';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import Decks from './Decks.svelte';
	import { ss } from './shared.svelte';
	import { underMouse } from './utils';
	import Rules from './Rules.svelte';
	import Tutorial from './Tutorial/• Tutorial.svelte';
	import { ts } from './Tutorial/ts.svelte';

	const onClick = (e) => {
		if (underMouse(e, ['#menu', '#rules', '#tutorial', '#decks'])) {
			e.stopPropagation();
			return;
		}

		if (ss.rules) {
			delete ss.rules;
		} else if (ss.tutorial) {
			delete ss.tutorial;
			ts.init();
		} else if (ss.menu && ss.tiles.some((t) => t.place)) {
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
