import Lazy from "../../lazy";
import Slice from "../../slice";
import Expr from "../expr";
import Statement from "../index";
import Call from "./call";

export default class Jump extends Statement {

	public arg: Lazy<[string, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
	}

}
