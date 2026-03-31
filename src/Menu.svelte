<script>
	import OppRobot from '$lib/images/Human vs Robot.webp';
	import OpHuman from '$lib/images/Human vs Human.webp';
	import { VS_HUMAN, VS_ROBOT } from './const';
	import { ss } from './shared.svelte';
	import { _sound } from './sound.svelte';
	import ToolButton from './Tool Button.svelte';
	import TextButton from './Text Button.svelte';

	const onOppSelect = (opp) => {
		ss.opp = opp;

		if (!_sound.musicPlayed) {
			_sound.playMusic();
		}
	};

	const onRules = () => {};

	const onTutorial = () => {};
</script>

<div class="menu">
	<div class="title grad-text grad-gold-blue">Hexotica</div>
	<div class="goal">Be the first to place 5 of your tiles in a straight line in any direction.</div>
	<div class="ops">
		<ToolButton id="tb-opp-robot" src={OppRobot} width={100} onClick={() => onOppSelect(VS_ROBOT)} />
		<ToolButton id="tb-opp-human" src={OpHuman} width={100} onClick={() => onOppSelect(VS_HUMAN)} />
	</div>
	<div class="ops help">
		<TextButton id='tb-rules' text={['Rules']} framed onClick={onRules} />
		<TextButton id='tb-tutorial' text={['Tutorial']} framed onClick={onTutorial} />
	</div>
</div>

<style>
	.menu {
		grid-area: 2/1;
		display: grid;
		place-self: center;
		box-sizing: border-box;
		/* border: 1px solid var(--text); */
		padding: 40px 30px;
		background: #ffffff10;
	}

	.title {
		font-family: CD;
		font-size: 48px;
		font-weight: bold;
		color: var(--text);
		letter-spacing: 0.1em;
		text-shadow:
			0 0 40px #f0d08080,
			0 0 80px #f0d08033;
		line-height: 1;
	}

	.goal {
		place-self: center;
		font-family: Crimson;
		font-style: italic;
		opacity: 0.75;
		font-size: 20px;
		width: 280px;
		margin-top: 20px;
	}

	.ops {
		place-self: center;
		display: grid;
		grid-auto-flow: column;
		gap: 50px;
		margin-top: 50px;
	}

	.help {
		gap: 30px;
		font-size: 20px;
	}
</style>
