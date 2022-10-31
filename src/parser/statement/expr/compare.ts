import type Expr from "./index";

type Operator = "==" | "!=";

export default class Compare implements Expr {
	public left: Expr;
	public right: Expr;
	public op: Operator;

	public constructor(op: Operator, left: Expr, right: Expr) {
		this.op = op;
		this.left = left;
		this.right = right;
	}
}
