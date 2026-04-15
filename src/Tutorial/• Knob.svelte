<script>
	import { HEX_DIMS, HEX_RATIO, HEX_WIDTH } from '../const';

	const { tile } = $props();
	const player = $derived(tile?.player);
	const width = $derived(HEX_WIDTH);
	const height = $derived(width / HEX_RATIO);
	const r = $derived(width * 1.3);
	const viewBox = `0 0 ${HEX_DIMS.X} ${HEX_DIMS.Y}`;
	const xmlns = 'http://www.w3.org/2000/svg';
	const shine = $derived(`var(--${player === 1 ? 'amber-shine' : 'slate-shine'})`);
</script>

<div class='knob nope'>
	<svg {width} {height} {viewBox} {xmlns}>
		<g class="core" stroke="none">
			<circle cx="363" cy="314" {r} fill="var(--bg)" stroke={shine} stroke-width={12} />
			<circle cx="363" cy="314" r={r * 0.65} fill="var(--{player === 1 ? 'amber-fill' : 'slate-stroke'})" />
			<circle cx={363 - r * 0.2} cy={314 - r * 0.2} r={r * 0.22} fill={shine} />
		</g>
	</svg>
</div>

<style>
	.knob {
		grid-area: 1/1;
		display: grid;
		place-content: center;
		place-items: center;
		z-index: 1;
	}

	svg {
		grid-area: 1/1;
	}

	.core {
		pointer-events: all;
	}
</style>
