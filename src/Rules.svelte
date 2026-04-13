<script>
	import { fade } from 'svelte/transition';
	import { ss } from './shared.svelte';
	import { scrollClass } from './utils';

	const ul = '<ul style="margin: -10px 0 0;">';
	const li = '<li style="margin: 10px 0 0 -20px;">';
	const hi = '<span style="color: var(--msg-success);">';
	const ye = '<span style="color: var(--amber-fill);">';
	const bl = '<span style="color: var(--slate-shine);">';
	const head = '<span style="font-weight: bold; margin-bottom: 10px; color: var(--amber-shine);">';
	const subhead = '<span style="margin-bottom: 10px; color: var(--amber-shine);">';
	const para = '<span style="margin-bottom: 10px;">';
	const S = '</span>';

	const CONTENT = `
${head}Setup${S}
${ul}
${li}Each player has a ${hi}deck${S} of 14 hexagonal tiles.
${li}Each tile has ${hi}6 sectors${S}, colored ${ye}yellow${S} or ${bl}blue${S}, and a colored ${hi}knob${S} identifying its ${hi}owner${S}.
</ul>
${head}${S}
${head}${S}
${head}Playing a turn${S}
${ul}
${li}A tile is drawn from your deck.${S}
${li}Optionally ${hi}reposition${S} any of your tiles already on the board (see below).${S}
${li}Place the drawn tile somewhere on the board.${S}
</ul>
${head}${S}
${head}${S}
${subhead}When placing a tile, it must:${S}
${ul}
${li}Be ${hi}adjacent${S} to at least one existing tile${S}
${li}Have ${hi}matching colors${S} on every shared side with its ${hi}neighbors${S}${S}
${li}You may ${hi}rotate${S} a tile freely while placing it.</ul>${S}
${head}${S}
${head}${S}
${head}Repositioning${S}
${para}${hi}Before${S} placing the drawn tile, you may ${hi}move${S} and/or ${hi}rotate${S} any of your tiles already on the board, subject to three constraints:${S}
${ul}
${li}${hi}Colors${S} must still ${hi}match${S} on all shared sides${S}
${li}The moved tile must end up with ${hi}at least as many${S} neighbors as it had before${S}
${li}All tiles on the board must remain in one connected group — ${hi}no isolated islands${S}</ul>${S}
${head}${S}
${head}${S}
${head}Skipping${S}
${para}If you cannot legally place the drawn tile anywhere, click your ${hi}opponent's icon${S} to skip your turn.${S}
		`;
</script>

{#if ss.rules}
	<div class="rules-container">
		<div id="rules" class="rules {scrollClass()}" tabindex="-1" transition:fade>
			<div class="content no-highlight" tabindex="-1">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html CONTENT}
			</div>
		</div>
	</div>
{/if}

<style>
	.rules-container {
		grid-area: 2/1;
		overflow: hidden;
		display: grid;
	}

	.rules {
		height: 100%;
		display: grid;
		place-self: center;
		box-sizing: border-box;
		/* border: 1px solid var(--text); */
		padding: 40px 30px;
		background: var(--menu-bg);
		z-index: 4;
		overflow-x: hidden;
	}

	.content {
		display: grid;
		align-content: start;
		width: 650px;
		font-size: 20px;
		color: var(--text);
		font-family: Crimson;
		font-style: italic;
	}
</style>
