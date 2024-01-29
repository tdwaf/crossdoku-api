<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle'
	import { Button } from '$lib/components/ui/button'
	import { Textarea } from '$lib/components/ui/textarea'
	import { AlertCircle } from 'lucide-svelte'
	import { Terminal } from 'lucide-svelte'
	import * as Alert from '$lib/components/ui/alert'
	import Navbar from '$lib/components/Navbar.svelte'

	export let data

	let isComplete = false
	let updateToggle = false
	let overwriteToggle = false

	let isError = false
	let errorMessage = ''

	let textValue: string = ''

	$: ({ session, supabase } = data)
	$: user = session?.user.user_metadata?.full_name

	async function deleteAnimeTitles() {
		const { error } = await supabase.from('anime_titles').delete().neq('answer', '')

		if (error) {
			isError = true
			errorMessage = error.message
			throw new Error(error.message)
		}
	}

	async function handleInput() {
		if (updateToggle) {
			const titles = textValue.split(',')

			for (const title of titles) {
				const { error } = await supabase.from('anime_titles').insert({ answer: title })

				if (error) {
					isError = true
					errorMessage = error.message
					throw new Error(error.message)
				}
			}

			textValue = ''
			isComplete = true
			return
		}

		if (overwriteToggle) {
			const titles = textValue.split(',')
			deleteAnimeTitles()

			for (const title of titles) {
				const { error } = await supabase.from('anime_titles').insert({ answer: title })

				if (error) {
					isError = true
					errorMessage = error.message
					throw new Error(error.message)
				}
			}
			return
		}
	}
</script>

<Navbar {user} {supabase} />

{#if isComplete}
	<Alert.Root>
		<Terminal class="h-4 w-4" />
		<Alert.Title class="text-[#16a34a]">Success!</Alert.Title>
		<Alert.Description>The anime titles have been added successfully!</Alert.Description>
	</Alert.Root>
{/if}

{#if isError}
	<Alert.Root variant="destructive">
		<AlertCircle class="h-4 w-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>{errorMessage}</Alert.Description>
	</Alert.Root>
{/if}

<div>
	<header>Making changes to the database is super simple.</header>

	<p>For inserting anime titles (won't overwrite the existing titles), ensure you toggle update.</p>
</div>

<h1>This is a protected page.</h1>

<div class="flex flex-row justify-center mt-5">
	<Toggle class="mr-2" variant="outline" bind:pressed={updateToggle}>Add Titles</Toggle>
	<Toggle variant="outline" bind:pressed={overwriteToggle}>Overwrite Titles</Toggle>
</div>
<div class="grid w-full gap-2 mt-1">
	<Textarea bind:value={textValue} placeholder="Type your message here." />
	<Button on:click={handleInput}>Send message</Button>
</div>
