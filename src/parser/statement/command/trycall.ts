import Lazy from "../../lazy";
import Slice from "../../slice";
import Statement from "../index";
import Call from "./call";

export default class TryCall extends Statement {
	public arg: Call["arg"];

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
	}

}
