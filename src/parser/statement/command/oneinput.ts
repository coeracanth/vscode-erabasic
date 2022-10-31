import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import Statement from "../index";

const PARSER = U.arg1R0(C.Int);
export default class OneInput extends Statement {
	public arg: Lazy<number | undefined>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

}
