import P from "parsimmon";

import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = P.alt<Expr | [Expr, Expr, Expr]>(
	U.arg3R3(X.expr, X.expr, X.expr),
	U.arg1R1(X.expr),
);
export default class SetBgColor extends Statement {
	public arg: Lazy<Expr | [Expr, Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

}
