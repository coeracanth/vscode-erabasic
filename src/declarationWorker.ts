import { readFile } from "fs";
import { decode } from "iconv-lite";
import { Uri } from "vscode";
import { parentPort, workerData } from "worker_threads";
import { Declaration } from "./declaration";

const wkdata: { dirty: [[string, string]], encodings: string[][] } = workerData;

Promise.all(wkdata.dirty.map(async ([path, fspath]): Promise<WorkerResponse> => {
    const input = await new Promise<string | undefined>((resolve, reject) => {
        readFile(path, (err, data) => {
            if (err) {
                if (typeof err === "object" && err.code === "ENOENT") {
                    resolve(undefined);
                } else {
                    reject(err);
                }
            } else {
                const decoded = decode(data, detect(path, data, wkdata.encodings));
                resolve(decoded);
            }
        });
    });
    if (input === undefined) {
        return { path: path, fspath: fspath, declarations: undefined };
    }

    return { path: path, fspath: fspath, declarations: readDeclarations(input) };
})).then(res => {
    if(!parentPort){
        return;
    }

    parentPort.postMessage(res)
});

export interface WorkerResponse {
    path: string;
    fspath: string;
    declarations: DeclarationObj[] | undefined;
}

interface UriObj extends Pick<Uri, "fsPath"> {
}

interface PositionObj {
    line: number;
    character: number;
}
interface RangeObj {
    start: PositionObj;
    end: PositionObj;
}

export interface DeclarationObj extends Omit<Declaration, "visible" | "isGlobal" | "container" | "bodyRange" | "nameRange"> {
    container: string | undefined;
    bodyRange: RangeObj;
    nameRange: RangeObj;
}

export function readDeclarations(input: string): DeclarationObj[] {
    const symbols: DeclarationObj[] = [];
    let funcStart: DeclarationObj | undefined;
    let funcEndLine: number | undefined;
    let funcEndChar: number | undefined;
    let docComment: string = "";
    for (const [line, text] of iterlines(input)) {
        const commentMatch = /\s*;{3}(@\S+)?(.*)/.exec(text);
        if (commentMatch !== null) {
            if (commentMatch[1]) {
                docComment = docComment.concat("\n\n*", commentMatch[1], "* -", commentMatch[2]);
                continue;
            }

            docComment = docComment.concat("\n", commentMatch[2]);
            continue;
        }

        {
            const match = /^\s*@([^\s\x21-\x2f\x3a-\x40\x5b-\x5e\x7b-\x7e]+)/.exec(text);
            if (match !== null) {
                // 空の関数のエラー回避
                if (funcStart !== undefined && funcEndLine != null && funcEndChar != null) {
                    funcStart.bodyRange.end.line = funcEndLine;
                    funcStart.bodyRange.end.character = funcEndChar;
                }
                funcStart = {
                    name: match[1],
                    kind: 11,//SymbolKind.Function
                    container: undefined,
                    nameRange: {
                        start: {
                            line: line,
                            character: match[0].length - match[1].length
                        },
                        end: {
                            line: line,
                            character: match[0].length
                        }
                    },
                    bodyRange: {
                        start: {
                            line: line,
                            character: 0
                        },
                        end: {
                            line: line,
                            character: text.length
                        }
                    },
                    documentation: docComment,
                }
                symbols.push(funcStart);
                docComment = "";
                continue;
            }
            funcEndLine = line;
            funcEndChar = text.length;
        }
        {
            const match = /^\s*#(DIMS?(?:\s+[A-Z]+)*|DEFINE)\s+([^\s\x21-\x2f\x3a-\x40\x5b-\x5e\x7b-\x7e]+)/.exec(text);
            if (match !== null) {
                symbols.push({
                    name: match[2],
                    kind: match[1].startsWith("DIM") ? 12 : 13,//SymbolKind.Variable : SymbolKind.Constant,
                    container: funcStart ? funcStart.name : undefined,
                    nameRange: {
                        start: {
                            line: line,
                            character: match[0].length - match[2].length
                        },
                        end: {
                            line: line,
                            character: match[0].length
                        }
                    },
                    bodyRange: {
                        start: {
                            line: line,
                            character: 0
                        },
                        end: {
                            line: line,
                            character: text.length
                        }
                    },
                    documentation: docComment,
                });
                docComment = "";
                continue;
            }
        }
    }
    docComment = "";

    if (funcStart !== undefined && funcEndLine != null && funcEndChar != null) {
        funcStart.bodyRange.end.line = funcEndLine;
        funcStart.bodyRange.end.character = funcEndChar;
    }
    return symbols;
}

function detect(path: string, data: Buffer, encodings: string[][]): string {
    if (data[0] === 0xef && data[1] === 0xbb && data[2] === 0xbf) {
        return "utf8";
    }
    if (data[0] === 0xff && data[1] === 0xfe) {
        return "utf16le";
    }
    if (data[0] === 0xfe && data[1] === 0xff) {
        return "utf16be";
    }
    const encode = encodings.find((v) => path.startsWith(v[0]));
    if (!encode) {
        return "utf8";
    }

    return encode[1];
}

function* iterlines(input: string): IterableIterator<[number, string]> {
    const lines = input.split(/\r?\n/);
    loop: for (let i = 0; i < lines.length; i++) {
        const text = lines[i];
        if (/^\s*(?:$|;(?![!#;];))/.test(text)) {
            continue;
        }
        if (/^\s*(?:;[!#];\s*)?\[SKIPSTART\]/.test(text)) {
            for (i++; i < lines.length; i++) {
                if (/^\s*(?:;[!#];\s*)?\[SKIPEND\]/.test(lines[i])) {
                    continue loop;
                }
            }
            break;
        }
        yield [i, text];
    }
}
