import P from "parsimmon";

import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import Expr from "../expr";
import Statement from "../index";

export default class Call extends Statement {
	public static PARSER = P.alt<[string, Array<Expr | undefined>]>(
		U.arg1R1(P.seq(
			C.Identifier.skip(C.WS0),
			U.wrap("(", ")", U.sepBy0(",", U.optional(X.expr))),
		)),
		U.argNR1(C.Identifier, U.optional(X.expr)).map(([f, ...r]) => [f, r]),
	);


	public arg: Lazy<[string, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
	}
}
