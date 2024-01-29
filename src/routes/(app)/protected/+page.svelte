<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle'
	import { Button } from '$lib/components/ui/button'
	import { Textarea } from '$lib/components/ui/textarea'
	import { AlertCircle } from 'lucide-svelte'
	import { Terminal } from 'lucide-svelte'
	import { getGridLayout } from './grid'
	import * as Dialog from '$lib/components/ui/dialog'
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

	async function addTitlesToAnimeTitlesTable(titles: string) {
		await deleteAnimeTitles()
		const titleList = titles.split(',')
		console.log(titleList)
		for (const title of titleList) {
			const { error } = await supabase.from('anime_titles').upsert({ answer: title })

			if (error) {
				isError = true
				errorMessage = error.message
				throw new Error(error.message)
			}
		}
	}

	async function getTitlesFromAnimeTitlesTable() {
		const { data, error } = await supabase.from('anime_titles').select('answer')

		if (error) {
			isError = true
			errorMessage = error.message
			throw new Error(error.message)
		}

		return data
	}

	async function assertDataInTable(): Promise<boolean> {
		let areEntries = false
		const { data, error } = await supabase.from('crossdoku_grid').select('grid_number')

		if (error) {
			isError = true
			errorMessage = error.message
			throw new Error(error.message)
		}

		if (data?.length !== 0) {
			areEntries = true
		}

		return areEntries
	}

	async function handleInput() {
		if (updateToggle) {
			const titles = await getTitlesFromAnimeTitlesTable()
			const dataAlreadyExists = await assertDataInTable()

			if (dataAlreadyExists) {
				const currentTitles = [...titles].map((t) => t.answer).join(', ')
				const newTitles = `${currentTitles}, ${textValue}`
				await addTitlesToAnimeTitlesTable(newTitles)
				const layout = getGridLayout(newTitles)

				const { error } = await supabase.from('crossdoku_grid').upsert({
					rows: layout.rows,
					columns: layout.cols,
					result: layout.result
				})

				if (error) {
					isError = true
					errorMessage = error.message
					throw new Error(error.message)
				}

				textValue = ''
				isComplete = true
				return
			}

			const layout = getGridLayout(textValue)
			const { error } = await supabase.from('crossdoku_grid').insert({
				rows: layout.rows,
				columns: layout.cols,
				result: layout.result
			})

			if (error) {
				isError = true
				errorMessage = error.message
				throw new Error(error.message)
			}

			textValue = ''
			isComplete = true
			return
		}

		if (overwriteToggle) {
			const layout = getGridLayout(textValue)
			await addTitlesToAnimeTitlesTable(textValue)

			const { error } = await supabase.from('crossdoku_grid').upsert({
				grid_number: 1,
				rows: layout.rows,
				columns: layout.cols,
				result: layout.result
			})

			if (error) {
				isError = true
				errorMessage = error.message
				throw new Error(error.message)
			}

			textValue = ''
			isComplete = true
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
	<header
		class="text-xl font-extrabold leading-tight tracking-tighter md:text-xl flex justify-center mt-3"
	>
		Making changes to the database is super simple.
	</header>

	<div class="flex justify-center mt-1">
		<Dialog.Root>
			<Dialog.Trigger>
				<Button>Instructions</Button>
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Instructions</Dialog.Title>
					<Dialog.Description>
						<p>
							If you want to add a title to the already existing titles list, toggle 'Add Titles'
						</p>

						<br />

						<p>If you want to overwrite all titles, toggle 'Overwrite Titles'</p>

						<br />

						<p>
							After toggling, enter the titles in a comma separated list (ex: anime1, anime2). If
							you're only adding one title, you can just enter the title without a comma.
						</p>
					</Dialog.Description>
				</Dialog.Header>
			</Dialog.Content>
		</Dialog.Root>
	</div>
</div>

<div class="flex flex-row justify-center mt-5">
	<Toggle class="mr-2" variant="outline" bind:pressed={updateToggle}>Add Titles</Toggle>
	<Toggle variant="outline" bind:pressed={overwriteToggle}>Overwrite Titles</Toggle>
</div>
<div class="grid w-full gap-2 mt-1">
	<Textarea bind:value={textValue} placeholder="Type your message here." />
	<Button on:click={handleInput}>Send message</Button>
</div>
