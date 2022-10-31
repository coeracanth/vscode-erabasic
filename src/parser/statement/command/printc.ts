import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import {PrintFlag} from "../../printer";
import Slice from "../../slice";
import Statement from "../index";

const PARSER = U.arg1R0(C.charSeq()).map((str) => str ?? "");
export default class PrintC extends Statement {
	public align: "LEFT" | "RIGHT";
	public flags: Set<PrintFlag>;
	public value: Lazy<string>;

	public constructor(align: PrintC["align"], flags: PrintFlag[], raw: Slice) {
		super(raw);

		this.align = align;
		this.flags = new Set(flags);
		this.value = new Lazy(raw, PARSER);
	}

}
