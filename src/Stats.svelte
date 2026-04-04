<script>
	import NumberFlow from '@number-flow/svelte';
	import { stats } from './shared.svelte';

	const { player } = $props();
	const wins = $derived(player === 1 ? stats.wins1 : stats.wins2);
</script>

<div class="stats {player === 1 ? 'p1' : 'p2'}">
	<NumberFlow value={wins} suffix={wins === 1 ? ' win' : ' wins'} />
</div>

<style>
	.stats {
		display: grid;
		place-self: center;
	}

	.p1 {
		grid-area: 1/2;
	}

	.p2 {
		grid-area: 1/4;
	}
</style>
