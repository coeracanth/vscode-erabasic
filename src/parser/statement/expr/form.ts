import type Expr from "./index";

export default class Form implements Expr {
	public expr: Array<{
		value: string | Expr;
		display?: Expr;
		align?: "LEFT" | "RIGHT";
	}>;

	public constructor(expr: Form["expr"]) {
		const merged: Form["expr"] = [];
		for (const e of expr) {
			const last = merged[merged.length - 1];
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (last != null && typeof last.value === "string" && typeof e.value === "string") {
				last.value += e.value;
			} else {
				merged.push(e);
			}
		}

		this.expr = merged;
	}
}
