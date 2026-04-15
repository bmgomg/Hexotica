<script>
	import { fade } from 'svelte/transition';
	import { DECK, HEXES } from './const';
	import Knob from './Knob.svelte';
	import { ss } from './shared.svelte';
	import Spot from './Spot.svelte';

	const getTile = (i, player) => {
        const bits = DECK[i];
		const tile = ss.tiles.find((t) => t.player === player && JSON.stringify(bits) === JSON.stringify(t.idBits));
        return tile;
	};
</script>

{#if ss.decks}
	<div id='decks' class="decks" in:fade>
		{#each [1, 2] as player (player)}
			<div class="deck">
				{#each HEXES as hex, i (i)}
					{@const row = i < 7 ? 1 : 2}
					{@const col = (i % 7) + 1}
					{@const tile = getTile(i, player)}
					<div class="hex no-highlight" style="grid-area: {row}/{col}">
						{#if tile.place}
							<Spot row={1} col={1} scale={0.9} deck/>
						{:else}
							<img src={hex} alt="" width='100%' />
                            <div class="knob"><Knob tile={{ player }} scale={0.9} /></div>
						{/if}
					</div>
				{/each}
			</div>
			{#if player === 1}
				<div class="divider"></div>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.decks {
		grid-area: 1/1/span 3/1;
		display: grid;
		place-self: center;
		box-sizing: border-box;
		padding: 40px 30px;
		background: var(--menu-bg);
		z-index: 4;
		gap: 10px;
	}

	.deck {
		display: grid;
		gap: 5px;
	}

	.hex {
		display: grid;
		place-items: center;
		width: 80px;
		/* aspect-ratio: 0.865; */
		aspect-ratio: 1.156;
	}

	img,
	.knob {
		grid-area: 1/1;
	}

	.divider {
		place-self: center;
		width: 400px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--text), transparent);
		margin: 35px 0;
	}
</style>
