<script>
	import { fade } from 'svelte/transition';
	import { ss } from './shared.svelte';

	const ul = '<ul style="margin: -10px 0 0;">';
	const li = '<li style="margin: 10px 0 0 -20px;">';
	const hi = '<span style="color: var(--msg-success);">';
	const ye = '<span style="color: var(--amber-fill);">';
	const bl = '<span style="color: var(--slate-shine);">';
	const head = '<span style="font-weight: bold; margin-bottom: 10px; color: var(--amber-shine);">';
	const subhead = '<span style="margin-bottom: 10px; color: var(--amber-shine);">';

	const CONTENT = `
${head}Setup</span>
${ul}
${li}Each player has a deck of 14 hexagonal tiles.
${li}Each tile has ${hi}6 sectors</span>, colored ${ye}yellow</span> or ${bl}blue</span>, and a colored ${hi}knob</span> identifying its ${hi}owner</span>.
</ul>
${head}</span>
${head}</span>
${head}Playing a turn</span>
${ul}
${li}A tile is drawn from your deck.</span>
${li}Optionally ${hi}reposition</span> any of your tiles already on the board (see below).</span>
${li}Place the drawn tile somewhere on the board.</span>
</ul>
${head}</span>
${head}</span>
${subhead}When placing a tile, it must:</span>
${ul}
${li}Be ${hi}adjacent</span> to at least one existing tile</span>
${li}Have ${hi}matching colors</span> on every shared side with its ${hi}neighbors</span></span>
${li}You may ${hi}rotate</span> a tile freely while placing it.</ul></span>
</ul>
		`;
</script>

{#if ss.rules}
	<div id="rules" class="rules" transition:fade>
		<div class="content" tabindex="-1">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html CONTENT}
		</div>
	</div>
{/if}

<style>
	.rules {
		grid-area: 2/1;
		display: grid;
		place-self: center;
		box-sizing: border-box;
		/* border: 1px solid var(--text); */
		padding: 40px 30px;
		background: var(--menu-bg);
		z-index: 4;
	}

	.content {
		display: grid;
		align-content: start;
		width: 600px;
		font-size: 20px;
		color: var(--text);
		font-family: Crimson;
		font-style: italic;
	}
</style>
