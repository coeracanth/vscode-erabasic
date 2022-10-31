import {parseThunk} from "../../parser/erb";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

const NEXT = /^NEXT$/i;
const PARSER = U.arg4R3(X.variable, X.expr, X.expr, X.expr);
export default class For extends Statement {
	public static parse(arg: Slice, lines: Slice[], from: number): [For, number] {
		let index = from + 1;

		const [thunk, consumed] = parseThunk(lines, index, (l) => NEXT.test(l));
		index += consumed + 1;

		return [new For(arg, thunk), index - from];
	}

	public arg: Lazy<[Variable, Expr, Expr, Expr | undefined]>;
	public thunk: Thunk;

	public constructor(raw: Slice, thunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
		this.thunk = thunk;
	}

}
