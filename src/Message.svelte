<script>
	import { fade } from 'svelte/transition';
	import { ss } from './shared.svelte';

</script>

{#if ss.message}
	<div class="message error" in:fade>{ss.message}</div>
{/if}

<style>
	.message {
		white-space: nowrap;
		/* font-size: 12px; */
		letter-spacing: 0.12em;
		padding: 7px 20px;
		border-radius: 2px;
	}

	.message.error {
		background: #2a1818;
		color: #e07860;
		border: 1px solid #5a2820;
	}

	.message.info {
		background: #1a2028;
		color: #7ab8d8;
		border: 1px solid #2a4858;
	}

	.message.success {
		background: #182018;
		color: #60b888;
		border: 1px solid #285838;
	}
</style>
