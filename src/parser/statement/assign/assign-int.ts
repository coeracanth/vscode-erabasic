import Lazy from "../../lazy";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Slice from "../../slice";
import type Expr from "../expr";
import Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.sepBy0(",", X.expr);
export default class AssignInt extends Statement {
	public dest: Variable;
	public arg: Lazy<Expr[]>;

	public constructor(dest: Variable, raw: Slice) {
		super(raw);
		this.dest = dest;

		this.arg = new Lazy(raw, PARSER);
	}

}
