<script>
	import { fade } from 'svelte/transition';
	import { MSG_INFO } from './const';
	import MusicVolume from './Music Volume.svelte';
	import { isMoving, makeGame, persist, roboTurn, showMessage, ss, stats } from './shared.svelte';
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
		if (roboTurn()) {
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

	const onHome = () => {
		ss.menu = true;
	};

	const onShowDecks = () => {
		ss.decks = true;
	};

	const newGameStyle = $derived(ss.over ? 'color: var(--msg-success); border: 1px solid var(--msg-success);' : '');
	const sfxStyle = 'width: 61px; justify-content: start;';
</script>

{#if !ss.message && !ss.choice}
	<div class="toolbar" in:fade>
		<TextButton id="tb-menu" text={['Home']} disabled={mustWait} onClick={onHome} />
		<TextButton id="tb-deck" text={['Show Decks']} onClick={onShowDecks} />
		<TextButton id="tb-new-game" text={['New Game']} style={newGameStyle} framed={ss.over} disabled={!canNewGame} onClick={onNewGame} />
		<TextButton id="tb-restats" text={['Reset Stats']} disabled={!stats.plays} onClick={onResetStats} />
		<MusicVolume />
		<TextButton id="tb-sfx" text={['SFX ' + (_sound.sfx ? 'On' : 'Off')]} sound={false} style={sfxStyle} onClick={onSfx} />
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
