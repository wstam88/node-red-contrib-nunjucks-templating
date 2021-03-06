function getNunjucksSnippets() {
    return [
        {
            label: "block",
            detail: "block defines a section on the template and identifies it with a name. This is used by template inheritance. Base templates can specify blocks and child templates can override them with new content.",
            insertText: "{% block ${1:name} %}\n\t$2\n{% endblock %}",
        },
        {
            label: "njk",
            detail: "A nunjucks template block.",
            insertText: "{% $1 %}",
        },
        {
            label: "v{}",
            detail: "A variable looks up a value from the template context.",
            insertText: "{{ ${1:variable} }}",
        },
        {
            label: "extends",
            detail: "extends is used to specify template inheritance. The specified template is used as a base template.",
            insertText: '{% extends "${1:template}" %}$2',
        },
        {
            label: "include",
            detail: 'Include pulls in other templates in place.It"s useful when you need to share smaller chunks across several templates that already inherit other templates.',
            insertText: '{% include "${1:template}" %}$2',
        },
        {
            label: "filter",
            detail: "A filter block allows you to call a filter with the contents of the block. Instead passing a value with the | syntax, the render contents from the block will be passed.",
            insertText: "{% filter ${1:filter} %}\n\t$2\n{% endfilter %}",
        },
        {
            label: "for",
            detail: "for iterates over arrays and dictionaries.",
            insertText:
                "{% for ${1:item} in ${2:sequence} %}\n\t$3\n{% endfor %}",
        },
        {
            label: "asyncEach",
            detail: "asyncEach is an asynchronous version of for. You only need this if you are using a custom template loader that is asynchronous; otherwise you will never need it. Async filters and extensions also need this, but internally loops are automatically converted into asyncEach if any async filters and extensions are used within the loop.",
            insertText:
                "{% asyncEach ${1:item} in ${2:sequence} %}\n\t$3\n{% endeach %}",
        },
        {
            label: "asyncAll",
            detail: "asyncAll is similar to asyncEach, except it renders all the items in parallel, preserving the order of the items. This is only helpful if you are using asynchronous filters, extensions, or loaders. Otherwise you should never use this.",
            insertText:
                "{% asyncAll ${1:item} in ${2:sequence} %}\n\t$3\n{% endeach %}",
        },
        {
            label: "if",
            detail: 'if tests a condition and lets you selectively display content. It behaves exactly as javascript"s if behaves.',
            insertText: "{% if ${1:condition} %}\n\t$2\n{% endif %}",
        },
        {
            label: "ife",
            detail: "It creates the if else block.",
            insertText:
                "{% if ${1:condition} %}\n\t$2\n{% else %}\n\t$3\n{% endif %}",
        },
        {
            label: "ifel",
            detail: "Alternate condition with the if block",
            insertText:
                "{% if ${1:condition} %}\n\t$2\n{% elif ${3:condition} %}\n\t$4\n{% else %}\n\t$5\n{% endif %}",
        },
        {
            label: "elif",
            detail: "Alternate condition in the if block",
            insertText: "{% elif ${1:condition} %}\n\t$2",
        },
        {
            label: "else",
            detail: "Alternate condition in the if block",
            insertText: "{% else ${1:condition} %}\n\t$2",
        },
        {
            label: "end",
            detail: "Alternate condition in the if block",
            insertText: "{% endif %}",
        },
        {
            label: "set",
            detail: "set lets you create/modify a variable.",
            insertText: "{% set ${1:var} = ${2:value} %}$3",
        },
        {
            label: "macro",
            detail: "macro allows you to define reusable chunks of content. It is similar to a function in a programming language. ",
            insertText:
                "{% macro ${1:name}(${2:args}) %}\n\t$3\n{% endmacro %}",
        },
        {
            label: "import",
            detail: "import loads a different template and allows you to access its exported values. Macros and top-level assignments (done with set) are exported from templates, allowing you to access them in a different template.",
            insertText: '{% import "${1:template}" as ${2:var} %}$3',
        },
        {
            label: "from",
            detail: "It imports specific values from a template into the current namespace.",
            insertText:
                '{% from "${1:template}" import ${2:macro} as ${3:var} %}$4',
        },
        {
            label: "raw",
            detail: "If you want to output any of the special nunjucks tags like {{, you can use raw and anything inside of it will be output as plain text.",
            insertText: "{% raw %}\n\t$1\n{% endraw %}",
        },
        {
            label: "call",
            detail: "A call block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. The content is available inside the macro as caller().",
            insertText: "{% call ${1:macro} %}\n\t$2\n{% endcall %}",
        },
        {
            label: "var",
            detail: "A variable looks up a value from the template context. If you wanted to simply display a variable, you would do: {{ username }}",
            insertText: "{{ ${1:var} }}",
        },
        {
            label: "super",
            detail: "You can render the contents of the parent block inside a child block by calling super.",
            insertText: "{{ super() }}",
        },
        { label: "or", detail: "Logical or operator.", insertText: "or" },
        {
            label: "pipe",
            detail: "You can pass filters from the variable directly e.g. {{ foo | escape }}",
            insertText: "| ${1:filter}",
        },
    ].map((i) => {
        return {
            ...i,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule
                    .InsertAsSnippet,
        };
    });
}
