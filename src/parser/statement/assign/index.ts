import P from "parsimmon";

import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Slice from "../../slice";
import Statement from "../index";
import AssignForm from "./assign-form";
import AssignInt from "./assign-int";
import AssignOpInt from "./assign-op-int";
import AssignOpStr from "./assign-op-str";
import AssignPostfix from "./assign-postfix";
import AssignStr from "./assign-str";

const PARSER_PREFIX = P.seq(U.alt("++", "--").trim(C.WS0), X.variable, P.all);
const PARSER_POSTFIX = P.seq(X.variable, U.alt("++", "--").trim(C.WS0), P.all);
const PARSER_VAR = P.seq(
	X.variable,
	P.alt(
		U.alt("="),
		U.alt("'="),
		U.alt("*=", "/=", "%=", "+=", "-=", "&=", "|=", "^="),
	).trim(C.WS0),
	P.all,
);
export default class Assign extends Statement {
	public inner?: AssignForm | AssignInt | AssignOpInt | AssignOpStr | AssignPostfix | AssignStr;

	public constructor(raw: Slice) {
		super(raw);
	}
}
