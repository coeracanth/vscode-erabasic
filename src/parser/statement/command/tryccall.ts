import {parseThunk} from "../../parser/erb";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import Statement from "../index";
import Call from "./call";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCCall extends Statement {
	public static parse(arg: Slice, lines: Slice[], from: number): [TryCCall, number] {
		let index = from + 1;

		const [thenThunk, consumedT] = parseThunk(lines, index, (l) => CATCH.test(l));
		index += consumedT + 1;

		const [catchThunk, consumedC] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
		index += consumedC + 1;

		return [new TryCCall(arg, thenThunk, catchThunk), index - from];
	}

	public arg: Call["arg"];
	public thenThunk: Thunk;
	public catchThunk: Thunk;

	public constructor(raw: Slice, thenThunk: Thunk, catchThunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
		this.thenThunk = thenThunk;
		this.catchThunk = catchThunk;
	}
}
