import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg5R1(X.variable, X.expr, X.expr, X.expr, X.expr);
export default class VarSet extends Statement {
	public arg: Lazy<[
		Variable,
		Expr | undefined,
		Expr | undefined,
		Expr | undefined,
		Expr | undefined,
	]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

}
