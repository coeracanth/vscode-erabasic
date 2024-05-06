import { CancellationToken, CompletionItem, CompletionItemKind, Hover, HoverProvider, MarkdownString, Position, ProviderResult, SymbolKind, TextDocument, workspace } from "vscode";
import { BuiltinComplationItems } from "./completion";
import { Declaration, DeclarationProvider, readDeclarations } from "./declaration";

export class EraHoverProvider implements HoverProvider {
    private repo: HoverRepository;

    constructor(private provider: DeclarationProvider) {
        this.repo = new HoverRepository(provider);
    }

    provideHover(document: TextDocument, position: Position, token: CancellationToken): Promise<Hover | undefined> {
        return this.repo.sync().then(() => this.repo.find(document, position));
    }
}

/**
 * 宣言からホバー要素を生成
 * @param decl 
 * @returns 
 */
function declToHover(decl: Declaration): Hover {
    return new Hover(
        new MarkdownString(`(${getName(decl.kind)}) ${decl.name}`.concat("\n\n---\n\n", decl.documentation))
    );
}

/**
 * 入力補完候補からホバー要素を生成
 * @param item 
 * @returns 
 */
function completionToHover(item: CompletionItem) {
    const doc = item.documentation;
    let content;
    if (!doc) {
        content = "";
    } else if (typeof (doc) === "string") {
        content = doc;
    } else {
        content = doc.value;
    }
    const detail = item.detail ? item.detail : `(${item.kind ? CompletionItemKind[item.kind] : ""}) ${item.label}`;
    return new Hover(
        new MarkdownString(detail.concat("\n\n---\n\n", content)),
    )
}

function getName(kind: SymbolKind) {
    return SymbolKind[kind];
}

/**
 * ホバー要素
 */
class HoverInfo {
    constructor(public name: string, public hover: Hover) {
    }
}

/**
 * ホバー要素のキャッシュ
 */
export class HoverRepository {
    private cache: Map<string, HoverInfo[]> = new Map();

    constructor(private provider: DeclarationProvider) {
        provider.onDidChange((e) => {
            this.cache.set(e.uri.fsPath, e.decls.filter((d) => d.isGlobal)
                .map((d) => new HoverInfo(d.name, declToHover(d))));
        });
        provider.onDidDelete((e) => {
            this.cache.delete(e.uri.fsPath);
        });
        provider.onDidReset((e) => {
            this.cache.clear();
        });
    }

    public sync(): Promise<void> {
        return this.provider.sync();
    }

    public find(document: TextDocument, position: Position): Hover | undefined {
        const word = this.getWord(document, position);
        if (word === undefined) {
            return;
        }

        {
            const res = this.findInBuiltIn(document, position, word);
            if (res) {
                res.range = getWordRange(document, position);
                return res;
            }
        }

        const res = this.findInCurrentDocument(document, position, word);
        if (res) {
            res.range = getWordRange(document, position);
            return res;
        }

        const ws = workspace.getWorkspaceFolder(document.uri);
        if (ws === undefined) {
            return;
        }
        for (const doc of workspace.textDocuments) {
            if (!doc.isDirty) {
                continue;
            }
            if (doc === document) {
                continue;
            }
            if (!this.cache.has(doc.uri.fsPath)) {
                continue;
            }
            if (!this.provider.reachable(ws, doc.uri.fsPath)) {
                continue;
            }

            const res = this.findInDocument(doc, word);
            if (res) {
                res.range = getWordRange(document, position);
                return res
            }
        }
        for (const [path, defs] of this.cache.entries()) {
            if (!this.provider.reachable(ws, path)) {
                continue;
            }

            const res = defs.find((d) => d.name === word);
            if (res) {
                res.hover.range = getWordRange(document, position);
                return res.hover;
            }
        }
    }

    private getWord(document: TextDocument, position: Position): string | undefined {
        const range = getWordRange(document, position);
        if (range !== undefined) {
            return document.getText(range);
        }
    }

    private findInBuiltIn(document: TextDocument, position: Position, word: string): Hover | undefined {
        const res = BuiltinComplationItems.find(c => c.label === word);
        if (!res) {
            return undefined;
        }
        return completionToHover(res);
    }

    private findInCurrentDocument(document: TextDocument, position: Position, word: string): Hover | undefined {
        const res = readDeclarations(document.getText())
            .find((d) => d.name === word && d.visible(position));
        if (!res) {
            return undefined;
        }
        return declToHover(res);
    }

    private findInDocument(document: TextDocument, word: string): Hover | undefined {
        const res = readDeclarations(document.getText())
            .find((d) => d.name === word && d.isGlobal);
        if (!res) {
            return undefined;
        }
        return declToHover(res);
    }
}

function getWordRange(document: TextDocument, position: Position): import("vscode").Range | undefined {
    return document.getWordRangeAtPosition(position, /[^\s\x21-\x2f\x3a-\x40\x5b-\x5e\x7b-\x7e]+/);
}

