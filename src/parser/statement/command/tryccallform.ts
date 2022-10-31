import {parseThunk} from "../../parser/erb";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import Statement from "../index";
import CallForm from "./callform";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCCallForm extends Statement {
	public static parse(arg: Slice, lines: Slice[], from: number): [TryCCallForm, number] {
		let index = from + 1;

		const [thenThunk, consumedT] = parseThunk(lines, index, (l) => CATCH.test(l));
		index += consumedT + 1;

		const [catchThunk, consumedC] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
		index += consumedC + 1;

		return [new TryCCallForm(arg, thenThunk, catchThunk), index - from];
	}

	public arg: CallForm["arg"];
	public thenThunk: Thunk;
	public catchThunk: Thunk;

	public constructor(raw: Slice, thenThunk: Thunk, catchThunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER(""));
		this.thenThunk = thenThunk;
		this.catchThunk = catchThunk;
	}

}
