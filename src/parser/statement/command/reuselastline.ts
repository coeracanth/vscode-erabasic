import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R0(X.form[""]);
export default class ReuseLastLine extends Statement {
	public arg: Lazy<Form | undefined>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

}
