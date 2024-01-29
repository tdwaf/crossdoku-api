<script lang="ts">
	import '../global.css'
	import { invalidate } from '$app/navigation'
	import { error, fail } from '@sveltejs/kit'
	import { onMount } from 'svelte'
	import { derived, writable } from 'svelte/store'
	import { goto } from '$app/navigation'
	export let data

	$: ({ supabase, session } = data)

	let supabaseStore = writable<typeof supabase>()
	$: supabaseStore.set(supabase)

	// this is necessary to ensure that subscriptions to old supabase clients are cleaned up properly
	// when a new client is retrieved from the loader.
	let supabaseAuthStateChangeSubscriptionStore = derived(supabaseStore, ($supabaseStore, set) => {
		const {
			data: { subscription }
		} = $supabaseStore.auth.onAuthStateChange((event, _session) => {
			const user = _session?.user.user_metadata?.full_name
			const authorizedUsers = [
				'tdwaf',
				'awaiz',
				'trapperhell',
				'plyrs',
				'astraltrinity7',
				'an1896',
				'kamatai',
				'mattskoo',
				'.shasaki',
				'shinya8977',
				'.starve.',
				'verose.'
			]

			if (_session) {
				if (!authorizedUsers.includes(user)) {
					goto('/auth/unauthorized')
					supabase.auth.signOut()
				}
			}

			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})
		set(subscription)
		return subscription.unsubscribe
	})

	onMount(() => {
		/* eslint-disable-next-line @typescript-eslint/no-empty-function */
		return supabaseAuthStateChangeSubscriptionStore.subscribe(() => {})
	})
</script>

<slot />
