<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'

	export let user: any
	export let supabase: any
	$: currentPage = $page.url.pathname
</script>

<header class="bg-background sticky top-0 z-40 w-full border-b">
	<div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
		<div class="flex gap-6 md:gap-10">
			<a class="flex items-center space-x-2" href="/"
				><span class="inline-block font-bold">crossdoku-api</span></a
			>
			<nav class="flex gap-6">
				<a
					class="flex items-center text-sm font-medium text-muted-foreground"
					href="/"
					class:active={'/' === currentPage}>Home</a
				>
				<a
					class="flex items-center text-sm font-medium text-muted-foreground"
					href="/protected"
					class:active={'/protected' === currentPage}>Update Database</a
				>
			</nav>
		</div>
		<div class="flex flex-1 items-center justify-end space-x-4">
			<nav class="flex items-center space-x-1">
				{#if !user}
					<Button on:click={() => goto('/auth')}>Sign in</Button>
				{:else}
					<Button on:click={() => supabase.auth.signOut()}>Sign out</Button>
				{/if}
			</nav>
		</div>
	</div>
</header>

<style>
	.active {
		@apply text-primary;
	}
</style>
