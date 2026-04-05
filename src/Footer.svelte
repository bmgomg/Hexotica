<script>
	import { fade } from 'svelte/transition';
	import { persist, ss } from './shared.svelte';
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
</script>

{#if !ss.menu}
	<div class="footer" transition:fade>
		<TextButton id="tb-menu" text={['Home']} onClick={() => (ss.menu = true)} />
		<TextButton id="tb-deck" text={['Show Deck']} onClick={() => {}} />
		<TextButton id="tb-restart" text={[ss.opp === OPP_ROBOT ? 'Surrender' : 'Start Over']} onClick={() => {}} />
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
