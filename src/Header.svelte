<script>
	import HumanY from '$lib/images/Human Yellow.webp';
	import HumanB from '$lib/images/Human Blue.webp';
	import Robot from '$lib/images/Robot.webp';
	import { ss } from './shared.svelte';
	import { OPP_ROBOT } from './const';
	import { fade } from 'svelte/transition';
</script>

{#if !ss.menu}
	<div class="header" transition:fade>
		<img class="p1" src={HumanY} alt="" width={60} />
        
		<img class="p2" src={ss.opp === OPP_ROBOT ? Robot : HumanB} alt="" width={60} />
	</div>
{/if}

<style>
	.header {
		grid-area: 1/1;
		place-self: center;
		align-content: center;
		display: grid;
		grid-auto-flow: column;
		grid: auto / auto 1fr 80px 1fr auto;
	}

	.p1 {
		grid-area: 1/1;
	}

	.p2 {
		grid-area: 1/5;
	}
</style>
