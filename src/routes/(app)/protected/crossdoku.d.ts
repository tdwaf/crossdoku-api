interface CrosswordLayoutResult {
	answer: string
	startx: number
	starty: number
	orientation: string
	position: number
}

export interface CrosswordLayoutResponse {
	rows: number
	cols: number
	result: Array<CrosswordLayoutResult>
}

export interface CrossdokuEntry {
	answer: string
	orientation: string
	position: number
	startx: number
	starty: number
}

export interface CrossdokuCell {
	x: number
	y: number
	letter: string | null
	userInput: string | null
	isCorrect: boolean
}
