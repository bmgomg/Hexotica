<script>
	import { fade } from 'svelte/transition';
	import { MSG_INFO, OPP_HUMAN, OPP_ROBOT } from './const';
	import { makeGame, showMessage, ss, stats } from './shared.svelte';
	import TextButton from './Text Button.svelte';
	import { _sound } from './sound.svelte';

	const onConfirm = () => {
		delete ss.choice;

		if (ss.opp === OPP_ROBOT) {
			showMessage('You surrendered!', MSG_INFO);

			stats.plays++;
			stats.wins2++;
		} else {
			showMessage('Game reset!', MSG_INFO);
		}

		makeGame();
	};

	const onCancel = () => {
		delete ss.choice;
	};

	const text = $derived([ss.opp === OPP_HUMAN ? 'Start over?' : 'Surrender?']);
	const style1 = 'color: var(--msg-error); border: 1px solid var(--msg-error);';
	const style2 = 'color: var(--msg-success); border: 1px solid var(--msg-success);';
</script>

{#if ss.choice}
	<div class="choice" in:fade>
		<TextButton id="tb-confirm" {text} framed style={style1} onClick={onConfirm} />
		<TextButton id="tb-cancel" text={['No']} framed style={style2} onClick={onCancel} />
	</div>
{/if}

<style>
	.choice {
		display: grid;
		grid-auto-flow: column;
		gap: 20px;
	}
</style>
