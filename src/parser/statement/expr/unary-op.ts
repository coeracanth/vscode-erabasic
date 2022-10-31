import type Expr from "./index";
import type Variable from "./variable";

type Operator = "++" | "--";

export default class UnaryOp implements Expr {
	public target: Variable;
	public op: Operator;
	public postfix: boolean;

	public constructor(target: Variable, op: Operator, postfix: boolean) {
		this.target = target;
		this.op = op;
		this.postfix = postfix;
	}
}
