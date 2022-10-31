import Lazy from "../../lazy";
import * as X from "../../parser/expr";
import Slice from "../../slice";
import Expr from "../expr";
import Variable from "../expr/variable";
import Statement from "../index";

const PARSER = X.expr;
type Operator = "+=";
export default class AssignOpStr extends Statement {
	public dest: Variable;
	public operator: Operator;
	public arg: Lazy<Expr>;

	public constructor(dest: Variable, operator: Operator, raw: Slice) {
		super(raw);
		this.dest = dest;
		this.operator = operator;

		this.arg = new Lazy(raw, PARSER);
	}
}
