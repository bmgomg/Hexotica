<script>
	import { fade } from 'svelte/transition';
	import { MSG_INFO, OPP_ROBOT } from './const';
	import MusicVolume from './Music Volume.svelte';
	import { isMoving, makeGame, persist, showMessage, ss, stats } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import TextButton from './Text Button.svelte';

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

	const canNewGame = $derived.by(() => {
		if (ss.over) {
			return true;
		}

		return !mustWait;
	});

	const onNewGame = () => {
		if (ss.over) {
			makeGame();
		} else {
			ss.choice = true;
		}
	};

	const onResetStats = () => {
		showMessage('Stats reset!', MSG_INFO);

		stats.plays = 0;
		stats.wins1 = 0;
		stats.wins2 = 0;

		persist();
	};

	const newGameStyle = $derived(ss.over ? 'color: var(--msg-success); border: 1px solid var(--msg-success);' : '');
</script>

{#if !ss.message && !ss.choice}
	<div class="toolbar" in:fade>
		<TextButton id="tb-menu" text={['Home']} disabled={mustWait} onClick={() => (ss.menu = true)} />
		<TextButton id="tb-deck" text={['Show Decks']} onClick={() => {}} />
		<TextButton id="tb-new-game" text={['New Game']} style={newGameStyle} framed={ss.over} disabled={!canNewGame} onClick={onNewGame} />
		<TextButton id="tb-restats" text={['Reset Stats']} disabled={!stats.plays} onClick={onResetStats} />
		<MusicVolume />
		<TextButton id="tb-sfx" text={['SFX ' + (_sound.sfx ? 'On' : 'Off')]} style="width: 61px; justify-content: start;" onClick={onSfx} />
	</div>
{/if}

<style>
	.toolbar {
		grid-area: 1/1;
		display: grid;
		grid-auto-flow: column;
		gap: 20px;
	}
</style>
