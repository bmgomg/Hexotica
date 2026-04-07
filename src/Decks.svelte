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
	<div class="decks" in:fade>
		{#each [1, 2] as player (player)}
			<div class="deck">
				{#each HEXES as hex, i (i)}
					{@const row = i < 7 ? 1 : 2}
					{@const col = (i % 7) + 1}
					{@const tile = getTile(i, player)}
					<div class="hex" style="grid-area: {row}/{col}">
						{#if tile.place}
							<Spot row={1} col={1} scale={0.8}/>
						{:else}
							<img src={hex} alt="" width={70} />
                            <div class="knob"><Knob tile={{ player }} scale={0.85} /></div>
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
		grid-area: 2/1;
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
		gap: 2px;
	}

	.hex {
		display: grid;
		place-items: center;
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
