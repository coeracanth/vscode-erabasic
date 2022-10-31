import { CancellationToken, DocumentFormattingEditProvider, FormattingOptions, ProviderResult, Range, TextDocument, TextEdit } from "vscode";
import parseERB from "./parser/parser/erb";

export class EraFormatter implements DocumentFormattingEditProvider {
    constructor() {
        
    }
    provideDocumentFormattingEdits(document: TextDocument, options: FormattingOptions, token: CancellationToken): ProviderResult<TextEdit[]> {
        const hoge = parseERB(new Map([["test",document.getText()]]),new Set());
        console.log(hoge);

        return [];
    }
}
