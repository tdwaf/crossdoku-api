interface CrosswordLayoutResult {
	answer: string
	startx: number
	starty: number
	orientation: string
}

export interface CrosswordLayoutResponse {
	rows: number
	cols: number
	result: Array<CrosswordLayoutResult>
}
