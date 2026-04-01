<script>
	const { color, scale } = $props();

	const palettes = {
		yellow: ['#d2bd88', '#c49029', '#d9ad51'],
		blue: ['#86aee0', '#3b7797', '#65a0ba'],
	};

	const palette = $derived(palettes[color] || palettes.yellow);
</script>

<div class="knob" style="border: 6px solid {palette[0]}; scale: {scale};">
	<div class="core" style="background: {palette[1]}"></div>
	<div class="shine" style="background: {palette[2]}"></div>
</div>

<style>
	.knob {
		grid-area: 1/1;
		display: grid;
		place-items: center;
		box-sizing: border-box;
		border-radius: 50%;
		background: var(--bg);
		aspect-ratio: 1;
		width: 142px;
	}

	.core {
		grid-area: 1/1;
		width: 86px;
		aspect-ratio: 1;
		border-radius: 50%;
	}

	.shine {
		grid-area: 1/1;
		width: 32px;
		aspect-ratio: 1;
		translate: -18px -18px;
		border-radius: 50%;
	}
</style>
