import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R1(X.form[""]);
export default class TryGotoForm extends Statement {
	public static parse(arg: Slice): TryGotoForm {
		return new TryGotoForm(arg);
	}

	public arg: Lazy<Form>;

	public constructor(raw: Slice) {
		super(raw);
		this.arg = new Lazy(raw, PARSER);
	}

}
