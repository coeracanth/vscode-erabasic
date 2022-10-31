
export type Leaf = bigint | string;
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export default interface _Value<T> {
	type: "string" | "number";
	name: string;
	value: T;
}
