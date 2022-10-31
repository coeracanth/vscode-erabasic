import Slice from "../slice";

export function normalize(raw: string): string {
	if (raw.startsWith("\uFEFF") || raw.startsWith("\uFFEF")) {
		return raw.slice(1);
	}
	return raw;
}

export function toLines(raw: string): Slice[] {
	const converted = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
	return converted.map((content, index) => new Slice("", index, content));
}

export function preprocess(lines: Slice[], macros: Set<string>): Slice[] {
	const fn: Array<(prev: Slice[]) => Slice[]> = [
		// Trim whitespaces
		(prev) => prev.map((line) => new Slice("", line.line, line.content.trim())),
		// Remove empty lines
		(prev) => prev.filter((line) => line.content.length > 0),
		// Concatenate lines inside braces
		(prev) => {
			const result: Slice[] = [];
			let index = 0;
			while (index < prev.length) {
				const line = prev[index];
				if (line.content === "{") {
					const endIndex =
						index + prev.slice(index).findIndex((l) => l.content === "}");
					const subLines = prev.slice(index + 1, endIndex);
					result.push(new Slice(
						subLines[0].file,
						subLines[0].line,
						subLines.map((l) => l.content).join("\n"),
					));
					index = endIndex + 1;
				} else {
					result.push(line);
					index += 1;
				}
			}

			return result;
		},
	];

	return fn.reduce((acc, val) => val(acc), lines);
}
