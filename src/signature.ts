import { CancellationToken, CompletionItem, CompletionItemKind, DocumentFormattingEditProvider, FormattingOptions, Position, ProviderResult, Range, SignatureHelp, SignatureHelpContext, SignatureHelpProvider, SymbolKind, TextDocument, TextEdit, workspace } from "vscode";
import { Declaration, DeclarationProvider, readDeclarations } from "./declaration";
import { BuiltinComplationItems } from "./completion";

/**
 * 引数説明のやつ
 */
export class EraSignatureHelpProvider implements SignatureHelpProvider {
    private repo: EraSignatureHelpRepository;

    constructor(private provider: DeclarationProvider) {
        this.repo = new EraSignatureHelpRepository(provider);
    }

    provideSignatureHelp(document: TextDocument, position: Position, token: CancellationToken, context: SignatureHelpContext): ProviderResult<SignatureHelp> {
        return this.repo.sync().then(() => this.repo.find(document, position));
    }
}

/**
 * 宣言から引数説明を生成
 * @param decl 
 * @returns 
 */
function declToHover(decl: Declaration): SignatureHelp {
    const sh = new SignatureHelp();
    return sh;
}

/**
 * 入力補完候補から引数説明を生成
 * @param item 
 * @returns 
 */
function completionToHover(item: CompletionItem) {
    const doc = item.documentation;
    let content;
    if (typeof (doc) === "string") {
        content = doc;
    } else {
        content = doc.value;
    }
    const detail = item.detail ? item.detail : `(${CompletionItemKind[item.kind]}) ${item.label}`;
    return new SignatureHelp()
}

function getName(kind: SymbolKind) {
    return SymbolKind[kind];
}

class HoverInfo {
    constructor(public name: string, public hover: SignatureHelp) {
    }
}


export class EraSignatureHelpRepository {
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

    public find(document: TextDocument, position: Position): SignatureHelp {
        const word = this.getWord(document, position);
        if (word === undefined) {
            return;
        }

        {
            const res = this.findInBuiltIn(document, position, word);
            if (res) {
                // res.range = getWordRange(document, position);
                return res;
            }
        }

        const res = this.findInCurrentDocument(document, position, word);
        if (res) {
            // res.range = getWordRange(document, position);
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
                // res.hover.range = getWordRange(document, position);
                return res.hover;
            }
        }
    }

    private getWord(document: TextDocument, position: Position): string {
        const range = getWordRange(document, position);
        if (range !== undefined) {
            return document.getText(range);
        }
    }

    private findInBuiltIn(document: TextDocument, position: Position, word: string): SignatureHelp {
        const res = BuiltinComplationItems.find(c => c.label === word);
        if (!res) {
            return undefined;
        }
        return completionToHover(res);
    }

    private findInCurrentDocument(document: TextDocument, position: Position, word: string): SignatureHelp {
        const res = readDeclarations(document.getText())
            .find((d) => d.name === word && d.visible(position));
        if (!res) {
            return undefined;
        }
        return declToHover(res);
    }

    private findInDocument(document: TextDocument, word: string): SignatureHelp {
        const res = readDeclarations(document.getText())
            .find((d) => d.name === word && d.isGlobal);
        if (!res) {
            return undefined;
        }
        return declToHover(res);
    }
}

function getWordRange(document: TextDocument, position: Position): import("vscode").Range {
    return document.getWordRangeAtPosition(position, /[^\s\x21-\x2f\x3a-\x40\x5b-\x5e\x7b-\x7e]+/);
}

