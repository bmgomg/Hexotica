<script>
	import HumanB from '$lib/images/Human Blue.webp';
	import HumanY from '$lib/images/Human Yellow.webp';
	import Robot from '$lib/images/Robot.webp';
	import { fade } from 'svelte/transition';
	import { OPP_ROBOT } from './const';
	import { ss } from './shared.svelte';
	import Tray from './Tray.svelte';
</script>

{#if !ss.menu}
	<div class="header" transition:fade>
		<img class="p1 {ss.actor === 1 ? 'spin' : ''}" src={HumanY} alt="" width={60} />
        <Tray />
		<img class="p2 {ss.actor === 2 ? 'spin' : ''}" src={ss.opp === OPP_ROBOT ? Robot : HumanB} alt="" width={60} />
	</div>
{/if}

<style>
	.header {
		grid-area: 1/1;
		place-self: center;
		align-items: center;
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

    .spin {
        animation: spin 0.5s alternate infinite linear;
    }

    @keyframes spin {
        from {
            transform: rotateY(0deg);
        }
        to {
            transform: rotateY(90deg);
        }
    }
</style>
