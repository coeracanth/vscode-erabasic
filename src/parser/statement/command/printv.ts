import P from "parsimmon";

import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import {PrintFlag} from "../../printer";
import Slice from "../../slice";
import type Expr from "../expr";
import Const from "../expr/const";
import Statement from "../index";

const PARSER = U.argNR0(P.alt(
	P.string("'").then(C.charSeq(",").map((str) => new Const(str))),
	X.expr,
));
export default class PrintV extends Statement {
	public flags: Set<PrintFlag>;
	public value: Lazy<Expr[]>;

	public constructor(flags: PrintFlag[], raw: Slice) {
		super(raw);

		this.flags = new Set(flags);
		this.value = new Lazy(raw, PARSER);
	}

}
