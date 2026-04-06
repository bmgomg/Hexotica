<script>
	import { post } from './utils';

	const { id, text, framed, style, disabled, onClick } = $props();

	let scale = $state(1);
	let timer = $state(false);

	const classes = $derived(['button-base no-highlight button ' + (framed ? 'framed' : 'text-only'), { disabled }]);
	const _style = $derived(`${style}; transform: scale(${scale})`);

	$effect(() => {
		const onTransitionEnd = (e) => {
			if (e.target.id !== id) {
				return;
			}

			if (e.propertyName !== 'transform') {
				return;
			}

			if (scale < 1) {
				scale = 1;
			} else {
				post(onClick);
			}
		};

		window.addEventListener('transitionend', onTransitionEnd);
		return () => window.removeEventListener('transitionend', onTransitionEnd);
	});

	const onPointerDown = () => {
		if (timer) {
			return;
		}

		scale = 0.85;

		timer = post(() => (timer = null), 500);
	};
</script>

<div {id} class={classes} onpointerdown={onPointerDown} style={_style}>
	{#each text as line, i (i)}
		<div>{line}</div>
	{/each}
</div>

<style>
	.button {
		place-self: center;
		display: grid;
		place-items: center;
		transition:
			transform 0.1s,
			color 0.3s;
		cursor: pointer;
		box-sizing: border-box;
	}

	.text-only:hover {
		filter: sepia(1);
	}

	.framed {
		border: 1px solid #f0d08080;
		padding: 0.3em 1em;
	}

	.framed:hover {
		border-color: var(--text);
	}

	.disabled {
		cursor: initial;
		pointer-events: none;
		color: #ffffff50;
	}

	.button:focus {
		outline: none !important;
	}
</style>
