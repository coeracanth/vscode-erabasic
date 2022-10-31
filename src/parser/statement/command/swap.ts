import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg2R2(X.variable, X.variable);
export default class Swap extends Statement {
	public arg: Lazy<[Variable, Variable]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}
}
