import P from "parsimmon";

import Lazy from "../../lazy";
import Slice from "../../slice";
import Variable from "../expr/variable";
import Statement from "../index";

const PARSER = P.eof;
type Operator = "++" | "--";
export default class AssignPostfix extends Statement {
	public dest: Variable;
	public operator: Operator;
	public arg: Lazy<undefined>;

	public constructor(dest: Variable, operator: Operator, raw: Slice) {
		super(raw);
		this.dest = dest;
		this.operator = operator;

		this.arg = new Lazy(raw, PARSER);
	}
}
