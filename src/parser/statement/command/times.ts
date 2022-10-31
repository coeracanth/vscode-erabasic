import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg2R2(X.variable, C.Float);
export default class Times extends Statement {
	public arg: Lazy<[Variable, number]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

}
