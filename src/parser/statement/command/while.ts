import {parseThunk} from "../../parser/erb";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type Expr from "../expr";
import Statement from "../index";

const WEND = /^WEND$/i;
const PARSER = U.arg1R1(X.expr);
export default class While extends Statement {
	public static parse(arg: Slice, lines: Slice[], from: number): [While, number] {
		let index = from + 1;

		const [thunk, consumed] = parseThunk(lines, index, (l) => WEND.test(l));
		index += consumed + 1;

		return [new While(arg, thunk), index - from];
	}

	public arg: Lazy<Expr>;
	public thunk: Thunk;

	public constructor(raw: Slice, thunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
		this.thunk = thunk;
	}

}
