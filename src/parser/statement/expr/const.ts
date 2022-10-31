import type {Leaf} from "../../value";
import type Expr from "./index";

export default class Const implements Expr {
	public value: Leaf;

	public constructor(value: Const["value"]) {
		this.value = value;
	}

}
