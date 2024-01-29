import type { CrosswordLayoutResponse } from './crossdoku'
import clg from 'crossword-layout-generator'

export function getGridLayout(titles: string) {
	const inputJson = titles.split(',').map((title) => ({ answer: title.trim() }))

	const layout: CrosswordLayoutResponse = clg.generateLayout(inputJson)

	return layout
}
