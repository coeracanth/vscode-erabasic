import * as U from "../../parser/util";
import Slice from "../../slice";
import Statement from "../index";

export const whitelist = ["GLOBAL", "GLOBALS"];

const PARSER = U.arg0R0();
export default class SaveGlobal extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

}
