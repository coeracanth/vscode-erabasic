import Lazy from "../../lazy";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Slice from "../../slice";
import type Form from "../expr/form";
import Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.sepBy0(",", X.form[","]);
export default class AssignForm extends Statement {
	public dest: Variable;
	public arg: Lazy<Form[]>;

	public constructor(dest: Variable, raw: Slice) {
		super(raw);
		this.dest = dest;

		this.arg = new Lazy(raw, PARSER);
	}
}
