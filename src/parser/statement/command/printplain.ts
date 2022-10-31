import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import Const from "../expr/const";
import Statement from "../index";

const PARSER_CONST = U.arg1R0(C.charSeq()).map((str) => new Const(str ?? ""));
const PARSER_FORM = U.arg1R0(X.form[""]).map((form) => form ?? new Const(""));
export default class PrintPlain extends Statement {
	public arg: Lazy<Expr>;

	public constructor(postfix: "FORM" | null, raw: Slice) {
		super(raw);

		switch (postfix) {
			case null: {
				this.arg = new Lazy(raw, PARSER_CONST);
				break;
			}
			case "FORM": {
				this.arg = new Lazy(raw, PARSER_FORM);
			}
		}
	}

}
