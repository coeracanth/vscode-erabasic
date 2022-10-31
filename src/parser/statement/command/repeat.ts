import {parseThunk} from "../../parser/erb";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type Expr from "../expr";
import Statement from "../index";

const REND = /^REND$/i;
const PARSER = U.arg1R1(X.expr);
export default class Repeat extends Statement {
	public static parse(arg: Slice, lines: Slice[], from: number): [Repeat, number] {
		let index = from + 1;

		const [thunk, consumed] = parseThunk(lines, index, (l) => REND.test(l));
		index += consumed + 1;

		return [new Repeat(arg, thunk), index - from];
	}

	public arg: Lazy<Expr>;
	public thunk: Thunk;

	public constructor(raw: Slice, thunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
		this.thunk = thunk;
	}

}
