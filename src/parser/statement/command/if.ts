import * as E from "../../error";
import {parseThunk} from "../../parser/erb";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import Thunk from "../../thunk";
import type Expr from "../expr";
import Statement from "../index";

const IF = /^IF\s+/i;
const ELSEIF = /^ELSEIF\s+/i;
const ELSE = /^ELSE$/i;
const ENDIF = /^ENDIF$/i;
const PARSER = U.arg1R1(X.expr);
export default class If extends Statement {
	public static parse(lines: Slice[], from: number): [If, number] {
		let index = from;
		const ifThunk: Array<[Slice, Thunk]> = [];
		let elseThunk = new Thunk([]);
		while (true) {
			if (lines.length <= index) {
				throw E.parser("Unexpected end of thunk in IF expression");
			}
			const current = lines[index];
			index += 1;

			if (IF.test(current.content)) {
				const [thunk, consumed] = parseThunk(
					lines,
					index,
					(l) => ELSEIF.test(l) || ELSE.test(l) || ENDIF.test(l),
				);
				ifThunk.push([current.slice("IF".length), thunk]);
				index += consumed;
			} else if (ELSEIF.test(current.content)) {
				const [thunk, consumed] = parseThunk(
					lines,
					index,
					(l) => ELSEIF.test(l) || ELSE.test(l) || ENDIF.test(l),
				);
				ifThunk.push([current.slice("ELSEIF".length), thunk]);
				index += consumed;
			} else if (ELSE.test(current.content)) {
				const [thunk, consumed] = parseThunk(
					lines,
					index,
					(l) => ENDIF.test(l),
				);
				elseThunk = thunk;
				index += consumed;
			} else if (ENDIF.test(current.content)) {
				return [new If(ifThunk, elseThunk), index - from];
			} else {
				throw E.parser("Unexpected statement in IF expression");
			}
		}
	}

	public ifThunk: Array<[Slice, Lazy<Expr>, Thunk]>;
	public elseThunk: Thunk;

	public constructor(ifThunk: Array<[Slice, Thunk]>, elseThunk: Thunk) {
		super(ifThunk[0][0]);
		this.ifThunk = ifThunk.map(([raw, thunk]) => [
			raw,
			new Lazy(raw, PARSER),
			thunk,
		]);
		this.elseThunk = elseThunk;
	}

}
