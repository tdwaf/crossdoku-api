<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle'
	import { Button } from '$lib/components/ui/button'
	import { Textarea } from '$lib/components/ui/textarea'
	import { AlertCircle } from 'lucide-svelte'
	import { Terminal } from 'lucide-svelte'
	import { getGridLayout } from './grid'
	import { generateCrossdokuGrid } from './grid'
	import * as Dialog from '$lib/components/ui/dialog'
	import * as Alert from '$lib/components/ui/alert'
	import Navbar from '$lib/components/Navbar.svelte'
	import type { CrossdokuCell, CrossdokuEntry, CrosswordLayoutResponse } from './crossdoku'
	import { onMount } from 'svelte'

	export let data
	let gridData: CrossdokuCell[][] = []

	let isComplete = false
	let addToggle = false
	let overwriteToggle = false
	let showGrid = false
	let index = 0

	let isError = false
	let errorMessage = ''

	let textValue: string = ''
	let cols = 0
	let rows = 0

	$: ({ session, supabase } = data)
	$: user = session?.user.user_metadata?.full_name
	$: gridStyleColumns = `repeat(${cols}, 1fr)`
	$: gridStyleRows = `repeat(${rows}, 1fr)`

	async function deleteAnimeTitles() {
		const { error } = await supabase
			.from('anime_titles')
			.delete()
			.neq('answer', 'neverwillbeanswer')

		if (error) {
			isError = true
			errorMessage = error.message
			throw new Error(error.message)
		}
	}

	async function getTitlesFromTitlesTable() {
		const { data, error } = await supabase.from('anime_titles').select('answer')

		if (error) {
			isError = true
			errorMessage = error.message
			throw new Error(error.message)
		}

		return data
	}

	async function addToTitlesTable(titles: string): Promise<void> {
		const titleList = titles.split(',')
		for (const title of titleList) {
			const { error } = await supabase.from('anime_titles').upsert({ answer: title })

			if (error) {
				isError = true
				errorMessage = error.message
				throw new Error(error.message)
			}
		}

		await getGridDataFromGridTable()
	}

	async function getGridDataFromGridTable() {
		const { data, error } = await supabase.from('crossdoku_grid').select('*')

		if (error) {
			isError = true
			errorMessage = error.message
			throw new Error(error.message)
		}

		const response = data[0]

		const crosswordLayoutResponse: CrosswordLayoutResponse = {
			rows: response.rows,
			cols: response.cols,
			result: response.result.map(
				(item: any): CrossdokuEntry => ({
					answer: item.answer,
					startx: item.startx,
					starty: item.starty,
					orientation: item.orientation,
					position: item.number
				})
			)
		}

		const crossdokuGrid: CrossdokuCell[][] = generateCrossdokuGrid(crosswordLayoutResponse)
		gridData = crossdokuGrid
		cols = crosswordLayoutResponse.cols
		rows = crosswordLayoutResponse.rows
	}

	async function assertDataInGridTable(): Promise<boolean> {
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

	async function upsertCrossdokuGrid(layout: CrosswordLayoutResponse): Promise<void> {
		const { error } = await supabase.from('crossdoku_grid').upsert({
			rows: layout.rows,
			cols: layout.cols,
			result: layout.result
		})

		if (error) {
			isError = true
			errorMessage = error.message
			throw new Error(error.message)
		}
	}

	async function upsertLetterIndexData(index: number, updatedCell: CrossdokuCell) {
		const { error } = await supabase.from('letter_index').insert({
			id: index,
			letter: updatedCell.letter,
			x: updatedCell.x,
			y: updatedCell.y,
			userInput: updatedCell.userInput,
			isCorrect: updatedCell.isCorrect
		})

		if (error) {
			isError = true
			errorMessage = error.message
			throw new Error(error.message)
		}
	}

	async function parseGridForLetterIndex(gridData: CrossdokuCell[][]): Promise<void> {
		const { error } = await supabase.from('letter_index').delete().neq('isCorrect', true)

		if (error) {
			isError = true
			errorMessage = error.message
			throw new Error(error.message)
		}

		gridData.forEach((row) => {
			row.forEach(async (cell) => {
				const updatedCell = {
					...cell,
					userInput: cell.letter?.toUpperCase() || ''
				}
				await upsertLetterIndexData(index++, updatedCell)
			})
		})
	}

	async function handleInput() {
		if (addToggle) {
			const gridExists = await assertDataInGridTable()

			if (gridExists) {
				const titles = await getTitlesFromTitlesTable()
				const currentTitles = [...titles].map((t) => t.answer).join(', ')
				const newTitles = `${currentTitles}, ${textValue}`
				const layout = getGridLayout(newTitles)

				await deleteAnimeTitles()
				await addToTitlesTable(newTitles)

				await upsertCrossdokuGrid(layout)

				await getGridDataFromGridTable()

				await parseGridForLetterIndex(gridData)

				textValue = ''
				isComplete = true
				return
			} else {
				const layout = getGridLayout(textValue)

				await addToTitlesTable(textValue)

				await upsertCrossdokuGrid(layout)

				await getGridDataFromGridTable()

				await parseGridForLetterIndex(gridData)

				textValue = ''
				isComplete = true
				return
			}
		}

		if (overwriteToggle) {
			const layout = getGridLayout(textValue)
			await deleteAnimeTitles()
			await addToTitlesTable(textValue)

			const { error } = await supabase.from('crossdoku_grid').upsert({
				grid_number: 1,
				rows: layout.rows,
				cols: layout.cols,
				result: layout.result
			})

			if (error) {
				isError = true
				errorMessage = error.message
				throw new Error(error.message)
			}

			await getGridDataFromGridTable()

			await parseGridForLetterIndex(gridData)

			textValue = ''
			isComplete = true
			return
		}
	}

	onMount(() => {
		getGridDataFromGridTable()
	})
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
		<Button class="ml-1" on:click={() => (showGrid = !showGrid)}>Preview Grid</Button>
	</div>
</div>

<div class="flex flex-row justify-center mt-5">
	<Toggle class="mr-2" variant="outline" bind:pressed={addToggle}>Add Titles</Toggle>
	<Toggle variant="outline" bind:pressed={overwriteToggle}>Overwrite Titles</Toggle>
</div>
<div class="grid w-full gap-2 mt-1">
	<Textarea bind:value={textValue} placeholder="Type your message here." />
	<Button on:click={handleInput}>Send message</Button>
</div>

{#if showGrid}
	<div class="container mt-1">
		<div
			class="crossword-grid"
			style="grid-template-columns: {gridStyleColumns}; grid-template-rows: {gridStyleRows};"
		>
			{#each gridData as row}
				{#each row as cell}
					<div class="cell {cell.letter ? 'filled' : 'empty'}">
						{#if cell.letter !== null}
							{cell.letter}
						{/if}
					</div>
				{/each}
			{/each}
		</div>
	</div>
{/if}

<style>
	.container {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-top: 3%;
	}

	.crossword-grid {
		display: grid;
		grid-gap: 1px;
		margin: auto;
		margin-right: 1rem;
		border-radius: 10px;
		box-shadow: 0px 6px 8px #aaa;
		overflow: hidden;
		max-width: 100vw;
		max-height: 80vh;
		width: 100%;
		height: 100%;
	}

	.cell {
		aspect-ratio: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.cell.filled {
		background-color: #6167c5;
		border: 1px solid #aaa;
		position: relative;
	}

	.empty {
		background-color: #e0e0e0;
	}

	@media (max-width: 900px) {
		.crossword-grid {
			grid-template-columns: repeat(var(--numCols), minmax(0, 1fr));
			grid-auto-rows: minmax(0, 1fr);
			flex-direction: column;
		}

		.container {
			flex-direction: column;
		}
	}

	@media (max-width: 320px) {
		.crossword-grid {
			--cell-size-width: calc(100vw / var(--numCols));
			--cell-size-height: calc(100vh / var(--numRows));
			--cell-size: min(var(--cell-size-width), var(--cell-size-height));

			grid-template-columns: repeat(var(--numCols), var(--cell-size));
			grid-auto-rows: var(--cell-size);
		}
	}
</style>
