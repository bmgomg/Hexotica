<script>
	import { fade } from 'svelte/transition';
	import { isMoving, persist, ss } from './shared.svelte';
	import TextButton from './Text Button.svelte';
	import { OPP_ROBOT } from './const';
	import { _sound } from './sound.svelte';
	import MusicVolume from './Music Volume.svelte';

	const onSfx = () => {
		_sound.sfx = !_sound.sfx;

		if (_sound.sfx) {
			_sound.play('won', { rate: 4 });
		}

		persist(true);
	};

	const mustWait = $derived.by(() => {
		if (ss.opp === OPP_ROBOT && ss.actor === 2) {
			return true;
		}

		if (isMoving()) {
			return true;
		}

		return false;
	});

	const canSurrender = $derived.by(() => {
		if (ss.over) {
			return false;
		}

		return !mustWait;
	});
</script>

{#if !ss.menu}
	<div class="footer" transition:fade>
		<TextButton id="tb-menu" text={['Home']} disabled={mustWait} onClick={() => (ss.menu = true)} />
		<TextButton id="tb-deck" text={['Show Deck']} onClick={() => {}} />
		<TextButton id="tb-surrender" text={[ss.opp === OPP_ROBOT ? 'Surrender' : 'Start Over']} disabled={!canSurrender} onClick={() => {}} />
		<TextButton id="tb-restats" text={['Reset Stats']} onClick={() => {}} />
		<MusicVolume />
		<TextButton id="tb-sfx" text={['SFX ' + (_sound.sfx ? 'On' : 'Off')]} style="width: 61px; justify-content: start;" onClick={onSfx} />
	</div>
{/if}

<style>
	.footer {
		grid-area: 3/1;
		display: grid;
		grid-auto-flow: column;
		gap: 20px;
		place-self: center;
	}
</style>
