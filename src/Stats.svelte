<script>
	import NumberFlow from '@number-flow/svelte';
	import { ss, stats } from './shared.svelte';
	import { INFO_STATS } from './const';

	const { player, info } = $props();
	const wins = $derived(player === 1 ? stats.wins1 : stats.wins2);
	const deck = $derived(ss.tiles.filter((t) => !t.place).length);
</script>

<div class="stats {info === INFO_STATS ? (player === 1 ? 'wins1' : 'wins2') : player === 1 ? 'deck1' : 'deck2'}">
	<NumberFlow value={info === INFO_STATS ? wins : deck} suffix={info === INFO_STATS ? (wins === 1 ? ' win' : ' wins') : ' in deck'} />
</div>

<style>
	.stats {
		display: grid;
		place-self: center;
	}

	.wins1 {
		grid-area: 1/1;
	}

	.wins2 {
		grid-area: 1/7;
	}

	.deck1 {
		grid-area: 1/3;
	}

	.deck2 {
		grid-area: 1/5;
	}
</style>
