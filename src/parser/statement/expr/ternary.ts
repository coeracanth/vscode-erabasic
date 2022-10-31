import type Expr from "./index";

export default class Ternary implements Expr {
	public condition: Expr;
	public left: Expr;
	public right: Expr;

	public constructor(condition: Expr, left: Expr, right: Expr) {
		this.condition = condition;
		this.left = left;
		this.right = right;
	}
}
