import {parser} from "lezer-rust"
import {continuedIndent, indentNodeProp, foldNodeProp, LezerSyntax} from "@codemirror/next/syntax"
import {styleTags} from "@codemirror/next/highlight"
import {Extension} from "@codemirror/next/state"

const statementIndent = continuedIndent()

/// A syntax provider based on the [Lezer Rust
/// parser](https://github.com/lezer-parser/rust), extended with
/// highlighting and indentation information.
export const rustSyntax = LezerSyntax.define(parser.withProps(
  indentNodeProp.add(type => {
    if (type.name == "IfExpression") return continuedIndent({except: /^\s*({|else\b)/})
    if (type.name == "String" || type.name == "BlockComment") return () => -1
    if (/(Statement|Item|Declaration|Definition|MatchArm|Parameter)$/.test(type.name)) return statementIndent
    return undefined
  }),
  foldNodeProp.add(type => {
    if (/(Block|edTokens|List)$/.test(type.name)) return tree => ({from: tree.start + 1, to: tree.end - 1})
    if (type.name == "BlockComment") return tree => ({from: tree.start + 2, to: tree.end - 2})
    return undefined
  }),
  styleTags({
    "const macro_rules mod struct union enum type fn impl trait let use crate static": "keyword definition",
    "pub unsafe async mut extern default move": "modifier",
    "for if else loop while match continue break return await": "keyword control",
    "as in ref": "operatorKeyword",
    "where _ crate super dyn": "keyword",
    "self": "self",
    String: "string",
    RawString: "string#2",
    Boolean: "bool",
    Identifier: "variableName",
    BoundIdentifier: "variableName definition",
    LoopLabel: "labelName",
    FieldIdentifier: "propertyName",
    Lifetime: "variableName#2",
    ScopeIdentifier: "namespace",
    TypeIdentifier: "typeName",
    "MacroInvocation/Identifier MacroInvocation/ScopedIdentifier/Identifier": "variableName#3",
    "MacroInvocation/TypeIdentifier MacroInvocation/ScopedIdentifier/TypeIdentifier": "variableName#3",
    "!": "variableName#3",
    UpdateOp: "updateOperator",
    LineComment: "lineComment",
    BlockComment: "blockComment",
    Integer: "integer",
    Float: "float",
    ArithOp: "arithmeticOperator",
    LogicOp: "logicOperator",
    BitOp: "bitwiseOperator",
    CompareOp: "compareOperator",
    "=": "operator definition",
    ".. ...": "punctuation",
    "=> -> :": "punctuation definition",
    "( )": "paren",
    "[ ]": "squareBracket",
    "{ }": "brace",
    ".": "derefOperator",
    "&": "operator",
    ", ; ::": "separator",
  })
), {
  languageData: {
    commentTokens: {line: "//", block: {open: "/*", close: "*/"}},
    indentOnInput: /^\s*(?:\{|\})$/
  }
})

/// Returns an extension that installs the Rust syntax.
export function rust(): Extension {
  return rustSyntax
}
