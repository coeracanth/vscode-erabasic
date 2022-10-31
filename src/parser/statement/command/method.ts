import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.argNR0(X.expr);
export default class Method extends Statement {
	public name: string;
	public arg: Lazy<Expr[]>;

	public constructor(name: string, raw: Slice) {
		super(raw);

		this.name = name;
		this.arg = new Lazy(raw, PARSER);
	}
}
