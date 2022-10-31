import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Expr from "../expr";
import Statement from "../index";

/* eslint-disable array-element-newline */
export const whitelist = [
	"DAY", "MONEY", "ITEM", "FLAG", "TFLAG", "UP", "PALAMLV", "EXPLV", "EJAC",
	"DOWN", "RESULT", "COUNT", "TARGET", "ASSI", "MASTER", "NOITEM", "LOSEBASE",
	"SELECTCOM", "PREVCOM", "TIME", "ITEMSALES", "PLAYER", "NEXTCOM", "PBAND",
	"BOUGHT",
	"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
	"P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
	"RANDDATA",
	"SAVESTR",
	"TSTR",
	"ISASSI", "NO",
	"BASE", "MAXBASE", "ABL", "TALENT", "EXP", "MARK", "PALAM", "SOURCE", "EX",
	"CFLAG", "JUEL", "RELATION", "EQUIP", "TEQUIP", "STAIN", "GOTJUEL", "NOWEX",
	"DOWNBASE", "CUP", "CDOWN", "TCVAR",
	"NAME", "CALLNAME", "NICKNAME", "MASTERNAME",
	"CSTR",
	// "CDFLAG",
	"DITEMTYPE", "DA", "DB", "DC", "DD", "DE",
	"TA", "TB",
];
/* eslint-enable array-element-newline */

const PARSER = U.arg2R2(X.expr, X.expr);
export default class SaveData extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

}
