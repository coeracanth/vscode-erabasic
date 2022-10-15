import * as fs from "fs";
import * as iconv from "iconv-lite";
import { Disposable, Event, EventEmitter, ExtensionContext, Uri, workspace, WorkspaceFolder } from "vscode";
import { WorkspaceEncoding } from "../declaration";


export interface CsvDeclaration {
    id: number;
    name: string;
    documentation: string;
    variableName: string;
    dimension: number;
}


function* iterlines(input: string): IterableIterator<[number, string]> {
    const lines = input.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        const text = lines[i];
        if (/^\s*(?:$|;(?!;;))/.test(text)) {
            continue;
        }
        yield [i, text];
    }
}

export function readDeclarations(input: string, fileName: string): CsvDeclaration[] {
    const fileNameMatch = fileName.match(/([^\\\/@]*)@?(\d*).[Cc][Ss][Vv]$/);
    const variableName = fileNameMatch[1].toUpperCase();
    const dimension = fileNameMatch[2] ? Number(fileNameMatch[2]) : 0;

    const symbols: CsvDeclaration[] = [];
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

        const match = /^\s*(\d*),\s*([^,]*)[$|,]?/.exec(text);
        if (match !== null) {
            symbols.push({
                name: match[2],
                id: Number(match[1]),
                documentation: docComment,
                variableName: variableName,
                dimension: dimension
            });
            docComment = "";
            continue;
        }

        docComment = "";
    }
    return symbols;
}

export class CsvDeclarationChangeEvent {
    constructor(public uri: Uri, public decls: CsvDeclaration[]) {
    }
}

export class CsvDeclarationDeleteEvent {
    constructor(public uri: Uri) {
    }
}

export class CsvDeclarationProvider implements Disposable {
    private fullscan: boolean = true;

    private dirty: Map<string, Uri> = new Map();

    private syncing: Promise<void>;

    private encoding: WorkspaceEncoding;

    private disposable: Disposable;

    private onDidChangeEmitter: EventEmitter<CsvDeclarationChangeEvent> = new EventEmitter();
    private onDidDeleteEmitter: EventEmitter<CsvDeclarationDeleteEvent> = new EventEmitter();
    private onDidResetEmitter: EventEmitter<void> = new EventEmitter();

    constructor() {
        this.encoding = new WorkspaceEncoding();

        const subscriptions: Disposable[] = [];

        const watcher = workspace.createFileSystemWatcher("**/*.[Cc][Ss][Vv]");
        watcher.onDidCreate(this.onDidChangeFile, this);
        watcher.onDidChange(this.onDidChangeFile, this);
        watcher.onDidDelete(this.onDidDeleteFile, this);
        subscriptions.push(watcher);

        workspace.onDidChangeConfiguration(this.onDidChangeWorkspace, this, subscriptions);
        workspace.onDidChangeWorkspaceFolders(this.onDidChangeWorkspace, this, subscriptions);

        this.disposable = Disposable.from(...subscriptions);
    }

    get onDidChange(): Event<CsvDeclarationChangeEvent> {
        return this.onDidChangeEmitter.event;
    }

    get onDidDelete(): Event<CsvDeclarationDeleteEvent> {
        return this.onDidDeleteEmitter.event;
    }

    get onDidReset(): Event<void> {
        return this.onDidResetEmitter.event;
    }

    public sync(): Promise<void> {
        if (this.syncing === undefined) {
            this.syncing = this.flush().then(() => {
                this.syncing = undefined;
            });
        }
        return this.syncing;
    }

    public dispose() {
        this.disposable.dispose();
    }

    private onDidChangeFile(uri: Uri) {
        this.dirty.set(uri.fsPath, uri);
    }

    private onDidDeleteFile(uri: Uri) {
        this.dirty.delete(uri.fsPath);
        this.onDidDeleteEmitter.fire(new CsvDeclarationDeleteEvent(uri));
    }

    private onDidChangeWorkspace() {
        this.fullscan = true;
        this.dirty.clear();
        this.encoding.reset();
        this.onDidResetEmitter.fire();
    }

    private async flush(): Promise<void> {
        if (this.fullscan) {
            this.fullscan = false;
            for (const uri of await workspace.findFiles("**/*.[Cc][Ss][Vv]")) {
                this.dirty.set(uri.fsPath, uri);
            }
        }
        if (this.dirty.size === 0) {
            return;
        }

        await Promise.all([...this.dirty].map(async ([path, uri]) => {
            // str.csvはnameではないので除外しておく
            if (path.match(/[Ss][Tt][Rr].[Cc][Ss][Vv]$/)) {
                this.dirty.delete(path);
                this.onDidDeleteEmitter.fire(new CsvDeclarationDeleteEvent(uri));
                return;
            }

            const input = await new Promise<string | undefined>((resolve, reject) => {
                fs.readFile(path, (err, data) => {
                    if (err) {
                        if (typeof err === "object" && err.code === "ENOENT") {
                            resolve(undefined);
                        } else {
                            reject(err);
                        }
                    } else {
                        resolve(iconv.decode(data, this.encoding.detect(path, data)));
                    }
                });
            });
            if (input === undefined) {
                this.dirty.delete(path);
                this.onDidDeleteEmitter.fire(new CsvDeclarationDeleteEvent(uri));
                return;
            }
            if (this.dirty.delete(path)) {
                this.onDidChangeEmitter.fire(new CsvDeclarationChangeEvent(uri, readDeclarations(input, path)));
                return;
            }
        }));

    }
}
