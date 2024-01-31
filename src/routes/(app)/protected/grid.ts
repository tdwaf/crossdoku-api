import type { CrosswordLayoutResponse, CrossdokuCell, CrossdokuEntry } from './crossdoku'
import clg from 'crossword-layout-generator'

export function getGridLayout(titles: string) {
	const inputJson = titles.split(',').map((title) => ({ answer: title.trim() }))

	const layout: CrosswordLayoutResponse = clg.generateLayout(inputJson)

	return layout
}

function createRow(rowLength: number, rowIndex: number): CrossdokuCell[] {
	return Array.from({ length: rowLength }, (_, columnIndex) => ({
		x: columnIndex,
		y: rowIndex,
		letter: null
	}))
}

function createGrid(gridSize: number): CrossdokuCell[][] {
	return Array.from({ length: gridSize }, (_, rowIndex) => createRow(gridSize, rowIndex))
}

export function generateCrossdokuGrid(layout: CrosswordLayoutResponse): CrossdokuCell[][] {
	const gridSize = layout.rows > layout.cols ? layout.rows : layout.cols
	const grid: CrossdokuCell[][] = createGrid(gridSize)
	const entries: CrossdokuEntry[] = layout.result

	entries.forEach((entry) => {
		for (let i = 0; i < entry.answer.length; i++) {
			const x = entry.orientation === 'across' ? entry.startx - 1 + i : entry.startx - 1
			const y = entry.orientation === 'down' ? entry.starty - 1 + i : entry.starty - 1

			grid[y][x].letter = entry.answer[i]
		}
	})

	return grid
}
