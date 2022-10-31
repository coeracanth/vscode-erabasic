import type Expr from "./index";

type Operator = "+" | "-" | "!" | "~";

export default class Unary implements Expr {
	public expr: Expr;
	public op: Operator;

	public constructor(op: Operator, expr: Expr) {
		this.op = op;
		this.expr = expr;
	}
}
