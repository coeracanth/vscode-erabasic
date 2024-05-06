import { CompletionItem, CompletionItemKind, CompletionItemTag, MarkdownString, Position, TextDocument, workspace } from "vscode";
import { EraBasicOption } from "../extension";
import { CsvDeclaration, CsvDeclarationProvider, readDeclarations } from "./declaration";

/**
 * CSV定義からの入力補完候補要素
 */
interface CompletionCsvItem extends CompletionItem {
    // CompletionItemでcacheしてるので補完候補の選別に必要な情報を持ち越す
    variableName: string;
    dimension: number;
}

/**
 * 入力補完候補のキャッシュ
 */
export class CompletionCsvItemRepository {
    private cache: Map<string, CompletionCsvItem[]> = new Map();
    private options = new EraBasicOption();

    /**
     * 変数表記を取得する。
     * @example
     * TALENT:HOGE => ["TALENT:HOGE", "TALENT"]
     */
    private readonly regVar = /(\w+|[^\x00-\x7F]+)(?::\((?:\w*|[^\x00-\x7F]*)\)|:[^:\W]*)*:[^\s\(\){%]*$/;

    constructor(private provider: CsvDeclarationProvider) {
        provider.onDidChange((e) => {
            this.cache.set(e.uri.fsPath, e.decls.map((d) => declToCompletionItem(d, { sort: this.options.sortVariableNames })));
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

    public *find(document: TextDocument, position: Position): IterableIterator<CompletionCsvItem> {
        const ws = workspace.getWorkspaceFolder(document.uri);
        if (ws === undefined) {
            return;
        }

        const linePrefix = document.lineAt(position).text.slice(0, position.character);
        const match = this.regVar.exec(linePrefix)
        if (!match) {
            return;
        }

        for (const [path, defs] of this.cache.entries()) {
            yield* defs.filter((d) => getRelatedVariableName(match[1].toUpperCase()) === d.variableName).map((d) => d);
        }
    }

    public isCsvCompletion(document: TextDocument, position: Position): boolean {
        const linePrefix = document.lineAt(position).text.slice(0, position.character);
        return this.regVar.test(linePrefix)
    }
}

/**
 * 対象の変数名に対して、要素名が指定できるCSV定義の変数名を返す
 * @param name 
 * @returns 対応するCSV定義の変数名
 * @example "LOSEBASE" => "BASE"
 */
function getRelatedVariableName(name: string) {
    switch (name) {
        case "LOSEBASE":
        case "MAXBASE":
        case "DOWNBASE":
            return "BASE";
        case "UP":
        case "DOWN":
        case "JUEL":
        case "GOTJUEL":
        case "CUP":
        case "CDOWN":
            return "PALAM";
        case "ITEMSALES":
        case "ITEMPRICE":
            return "ITEM";
        case "STR":
            return "STRNAME";
        case "NOWEX":
            return "EX";
        default:
            return name;
    }
}

/**
 * CSVで宣言された要素から入力補完候補を生成
 * @param decreation 
 * @param options 
 * @returns 
 */
export function declToCompletionItem(decreation: CsvDeclaration, options: { sort: string } = { sort: "id" }): CompletionCsvItem {
    return {
        label: decreation.name,
        kind: CompletionItemKind.Value,
        detail: `${decreation.variableName}${decreation.dimension ? `@${decreation.dimension}` : ""}:${decreation.id} = ${decreation.name}`,
        documentation: new MarkdownString(decreation.documentation),
        variableName: decreation.variableName,
        dimension: decreation.dimension,
        sortText: getSortText(options.sort, decreation)
    };
}

/**
 * 表示するCSV定義の表示順取得
 * @param key 
 * @param decreation 
 * @returns 
 */
function getSortText(key: string, decreation: CsvDeclaration) {
    switch (key) {
        case "name":
            return decreation.name
        case "id":
        default:
            // なんの根拠もなくとりあえず6桁
            return decreation.id.toString(6).padStart(6, "0")
    }
}
