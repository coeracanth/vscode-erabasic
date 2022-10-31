import Lazy from "../../lazy";
import Slice from "../../slice";
import Statement from "../index";
import CallForm from "./callform";

export default class TryCallForm extends Statement {
	public arg: CallForm["arg"];

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER("(,"));
	}
}
