<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import Navigation from '$lib/components/Navbar.svelte'
	import { goto } from '$app/navigation'
	export let data

	$: ({ session, supabase } = data)
	$: user = data.session?.user
	$: user_metadata = data.session?.user?.user_metadata
</script>

<Navigation {user} {supabase} />
<div>
	{#if session != null}
		<h1
			class="text-6xl font-extrabold leading-tight tracking-tighter md:text-6xl flex justify-center mt-3"
		>
			Hello, {user_metadata?.full_name}
		</h1>

		<p class="max-w-screen-3xl text-xl text-muted-foreground flex justify-center mt-3">
			You can begin making changes to the anime list <a
				href="/protected"
				class="ml-1 text-[#0ea5e9]">here</a
			>.
		</p>
	{:else}
		<h1
			class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl flex justify-center mt-3"
		>
			crossdoku-api
		</h1>

		<p class="max-w-screen-2xl text-lg text-muted-foreground flex justify-center mt-3">
			This API is designed to streamline overwriting or inserting anime titles to the database.
		</p>

		<div class="flex gap-4 justify-center mt-3">
			<Button on:click={() => goto('/auth')}>Sign in</Button>
		</div>
	{/if}
</div>
