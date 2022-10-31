import Expr from "../statement/expr";

export default class LocalSize {
	public size: Expr;

	public constructor(size: Expr) {
		this.size = size;
	}
}
