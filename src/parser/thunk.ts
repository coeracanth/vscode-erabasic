import Statement from "./statement";
import Case from "./statement/command/case";
import DoWhile from "./statement/command/dowhile";
import For from "./statement/command/for";
import If from "./statement/command/if";
import Repeat from "./statement/command/repeat";
import While from "./statement/command/while";

export default class Thunk {
	public statement: Statement[];
	public labelMap: Map<string, number>;

	// NOTE: `statement` argument is mixed array of statments and labels
	public constructor(statement: Array<Statement | string>) {
		this.statement = [];
		this.labelMap = new Map();

		for (let i = 0; i < statement.length; ++i) {
			const s = statement[i];
			if (typeof s === "string") {
				this.labelMap.set(s, this.statement.length);
			} else {
				this.statement.push(s);
			}
		}

		for (let i = 0; i < this.statement.length; ++i) {
			const s = this.statement[i];

			if (s instanceof Case) {
				for (const branch of s.branch) {
					branch[1].labelMap.forEach((_, l) => this.labelMap.set(l, i));
				}
				s.def.labelMap.forEach((_, l) => this.labelMap.set(l, i));
			} else if (s instanceof For) {
				s.thunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
			} else if (s instanceof If) {
				for (const [,, thunk] of s.ifThunk) {
					thunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
				}
				s.elseThunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
			} else if (s instanceof Repeat) {
				s.thunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
			} else if (s instanceof While) {
				s.thunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
			} else if (s instanceof DoWhile) {
				s.thunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
			}
		}
	}
}
