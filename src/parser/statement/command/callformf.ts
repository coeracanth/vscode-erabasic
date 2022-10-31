import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
import CallForm from "./callform";

export default class CallFormF extends Statement {
	public arg: Lazy<[Form, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER("(,"));
	}
}