import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg3R3(X.expr, X.expr, X.expr);
export default class Bar extends Statement {
	public arg: Lazy<[Expr, Expr, Expr]>;
	public newline: boolean;

	public constructor(raw: Slice, newline: boolean = false) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
		this.newline = newline;
	}

}