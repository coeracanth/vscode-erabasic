import Lazy from "../../lazy";
import Slice from "../../slice";
import Statement from "../index";
import Call from "./call";
import Jump from "./jump";

export default class TryJump extends Statement {
	public arg: Jump["arg"];

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
	}
}
