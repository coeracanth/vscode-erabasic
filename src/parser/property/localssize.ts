import Expr from "../statement/expr";

export default class LocalSSize {
	public size: Expr;

	public constructor(size: Expr) {
		this.size = size;
	}

}
