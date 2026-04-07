<script>
	import GamePage from '../Game Page.svelte';
	import { loadCommon } from '../shared.svelte';
	import { _sound } from '../sound.svelte';
	import Splash from '../Splash.svelte';
	import { post } from '../utils';

	$effect(() => {
		loadCommon();

		const disable = (e) => {
			e.preventDefault();
		};

		const toggleMusic = () => {
			_sound.music = -_sound.music;
			_sound.playMusic();
		};

		const onBlur = () => {
			if (_sound.music > 0) {
				toggleMusic();
			}
		};

		const onFocus = () => {
			if (_sound.music < 0) {
				toggleMusic();
			}
		};

		window.addEventListener('contextmenu', disable);
		window.addEventListener('dblclick', disable);
		window.addEventListener('blur', onBlur);
		window.addEventListener('focus', onFocus);

		return () => {
			window.removeEventListener('contextmenu', disable);
			window.removeEventListener('dblclick', disable);
			document.removeEventListener('blur', onBlur);
			document.removeEventListener('focus', onFocus);
		};
	});

	let splash = $state(true);
	post(() => (splash = false), 2000);
</script>

<div class="app">
	{#if splash}
		<Splash />
	{:else}
		<GamePage />
	{/if}
</div>

<style>
	.app {
		height: 100dvh;
		display: grid;
		box-sizing: border-box;
	}
</style>
