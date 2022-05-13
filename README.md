# node-red-contrib-nunjucks-templating
A rich and powerful templating language for JavaScript right in Node-RED. 
For all of the Nunjucks template features checkout the **[official Nunjucks documentation](https://mozilla.github.io/nunjucks/templating.html)**

![Macro usage](https://raw.githubusercontent.com/wstam88/node-red-contrib-nunjucks-templating/main/resources/images/nunjucks.webp)

## Options
You can define any valid **[Nunjucks options](https://mozilla.github.io/nunjucks/api.html#configure)** in the Node-RED settings.js file.
`nunjucks.options`


## Loading templates
Templates can be defined with the **Nunjucks template** nodes or be loaded from the file system using preconfigured folders for lookup. Loading is done automatically in the following order: 
1. Defined templates as nodes within the project that matches the name
2. Looking for files in one of the configures folders

```js
nunjucks: {
    folders: ["./my-templates", "./templates"],
}
```

This means you don't have to worry about where the template is defined while including it in your templates.

## Template inheritance
`extends` is used to specify template inheritance. The specified template is used as a base template.
See [Template Inheritance](https://mozilla.github.io/nunjucks/templating.html#extends).
![](https://raw.githubusercontent.com/wstam88/node-red-contrib-nunjucks-templating/main/resources/images/base_template.png)
![Macro usage](https://raw.githubusercontent.com/wstam88/node-red-contrib-nunjucks-templating/main/resources/images/macro_usage.png)

## Custom filters
You can register filters using the global function `nj.addFilter`

```js
// Value will be whatever is piped to the filter
function myFilter(value) {
    return `Foo: ${value}!!`
}

global.get('nj.addFilter')('myFilter', myFilter)
```

Now you can use it in all of your templates like: `{{ 'bar' | foo }}`

**Output:** `Foo: bar!!`

## Passing functions 
Functions can be passed like any other variables as context.
```js
// context
msg.payload = {
    foo: 'bar',
    reverse: value => value.split('').reverse().join('')
}
```

```twig
{# template #}
{{ reverse(foo) }}
```

**Output:** `rab`


## Global context
You can add global variables in multiple ways:
1. Add a section to settings.js like this:
```js
nunjucks: {
    global: {
        foo: 'bar',
        app: {
            name: 'My Awesome App'
        }
    }
}
```
Now you can access it anywhere like so: `{{ app.name }} and {{ foo }}`.

2. Add it within a function node: `global.get('nj.addGlobal')('myVar', 'Some value')`
Access it anywhere in any template or macro: `{{ myVar }}` 

## Snippets
Nunjucks snippets are provided for the Monaco editor only. Press ctrl+spacebar to list the available snippets.

* asyncAll
* asyncEach
* block
* call
* elif
* else
* end
* extends
* filter
* for
* from
* if
* ife
* ifel
* import
* include
* macro
* njk
* or
* pipe
* raw
* set
* super
* var
* v{}

## Macros
"`macro` allows you to define reusable chunks of content. It is similar to a function in a programming language."

Simple place your macros in a Nunjucks template node or in a file. The macros can be imported simply by there node name or filename. You can have one or more macros in one or more Nunjuck template nodes or files.

### Defining macros
![Macro definitions](https://raw.githubusercontent.com/wstam88/node-red-contrib-nunjucks-templating/main/resources/images/macro_definition.png)
 
### Using macros
![Macro usage](https://raw.githubusercontent.com/wstam88/node-red-contrib-nunjucks-templating/main/resources/images/macro_usage.png)


## Other global functions
* global.get("nj.addFilter");
* global.get("nj.getFilter");
* global.get("nj.addExtension");
* global.get("nj.getExtension");
* global.get("nj.hasExtension");
* global.get("nj.removeExtension");
* global.get("nj.getTemplate");
* global.get("nj.addGlobal");
* global.get("nj.getGlobal");
* global.get("nj.renderString");

## Examples

```
[{"id":"79b0f31660687179","type":"http response","z":"e78f061152fe82f8","name":"","statusCode":"","headers":{},"x":890,"y":120,"wires":[]},{"id":"f39790b7c1b32cbb","type":"nunjucks_render","z":"e78f061152fe82f8","template":"{% extends \"base.html\" %}\n\n{% import \"cards.html\" as cards %}\n\n{% block body %}\n{% call cards.card(card) %}\n  <form>\n    <div class=\"row\">\n      <div class=\"col\">\n        <input type=\"text\" class=\"form-control\" id=\"firstname\" name=\"firstName\" placeholder=\"Firstname\" value=\"{{ request.query.firstName }}\">\n      </div>\n      <div class=\"col\">\n        <input type=\"text\" class=\"form-control\" id=\"firstname\" name=\"lastName\" placeholder=\"Lastname\" value=\"{{ request.query.lastName }}\">\n      </div>\n    </div>\n\n    {# How to call your custom filters #}\n    <div class=\"my-4\">\n    {{ 'Hello' | myFilter }}\n    </div> \n\n    \n    <button type=\"submit\" class=\"btn btn-dark mt-3\">Give me a joke!</button>\n  </form>\n{% endcall %}\n{% endblock %}","x":760,"y":120,"wires":[["79b0f31660687179"]]},{"id":"45ba6e37f1581888","type":"function","z":"e78f061152fe82f8","name":"","func":"msg.payload = {\n    card: {\n        title: 'A Random Joke',\n        text: msg.payload.value.joke,\n        image: {\n            src: 'https://cdn.dribbble.com/users/1774513/screenshots/3726127/media/ef86424ae75426acfa624dfadcabda14.jpg?compress=1&resize=400x300'\n        },\n        buttons: [{\n            label: 'Another Joke',\n            href: '#',\n            className: 'btn btn-dark'\n        }]\n    }\n}\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":620,"y":120,"wires":[["f39790b7c1b32cbb"]]},{"id":"fe5e86af251c9c02","type":"http request","z":"e78f061152fe82f8","name":"","method":"use","ret":"obj","paytoqs":"ignore","url":"","tls":"","persist":false,"proxy":"","authType":"","senderr":false,"x":470,"y":120,"wires":[["45ba6e37f1581888"]]},{"id":"f9cf633ec1b34528","type":"function","z":"e78f061152fe82f8","name":"payload","func":"global.get('nj.addGlobal')('request', msg.req)\n\nconst firstName = msg.req.query.firstName || 'Chuck'\nconst lastName = msg.req.query.lastName || 'Norris'\n\nmsg.method = 'GET'\nmsg.url = `http://api.icndb.com/jokes/random?firstName=${firstName}&lastName=${lastName}`\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":320,"y":120,"wires":[["fe5e86af251c9c02"]]},{"id":"1fdca429c8c60b6f","type":"http in","z":"e78f061152fe82f8","name":"","url":"/example/joke","method":"get","upload":false,"swaggerDoc":"","x":150,"y":120,"wires":[["f9cf633ec1b34528"]]},{"id":"7c41b5ed52f53c40","type":"nunjucks","z":"e78f061152fe82f8","name":"cards.html","template":"{% macro card(card) %}\n<div class=\"card\">\n  {% if card.image %}\n    <img src=\"{{ card.image.src  }}\" class=\"card-img-top\" alt=\"{{ card.image.alt  }}\">\n  {% endif %}\n\n  <div class=\"card-body\">\n  {% if card.title %}\n    <h5 class=\"card-title\">{{ card.title }}</h5>\n  {% endif %}\n\n  {% if card.text %}\n    <p class=\"card-text\">{{ card.text }}</p>\n  {% endif %}\n\n  {{  caller() }}\n  </div>\n</div>\n{% endmacro %}","x":120,"y":320,"wires":[]},{"id":"3d4160d4d2e68eef","type":"nunjucks","z":"e78f061152fe82f8","name":"base.html","template":"<!doctype html>\n<html lang=\"en\">\n  <head>\n    <!-- Required meta tags -->\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\n    <!-- Bootstrap CSS -->\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\">\n    \n    <title>{% block title %}Nunjucks Rocks!{% endblock %}</title>\n  </head>\n  <body>\n    {% include \"navbar.html\" %}\n    <div class=\"container\" style=\"margin-top: 80px;\">\n      {% block body %}\n        <h1>Hello, world!</h1>\n      {% endblock %}\n    </div>\n    <!-- Optional JavaScript; choose one of the two! -->\n\n    <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js\" integrity=\"sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p\" crossorigin=\"anonymous\"></script>\n    <script src=\"https://unpkg.com/htmx.org@1.7.0\" integrity=\"sha384-EzBXYPt0/T6gxNp0nuPtLkmRpmDBbjg6WmCUZRLXBBwYYmwAUxzlSGej0ARHX0Bo\" crossorigin=\"anonymous\" defer></script>\n\n    {% block footer %}{% endblock %}\n  </body>\n</html>","x":120,"y":280,"wires":[]},{"id":"754c717efb65ad56","type":"nunjucks","z":"e78f061152fe82f8","name":"navbar.html","template":"<nav class=\"navbar navbar-light bg-light fixed-top\">\n  <div class=\"container-fluid\">\n    <a class=\"navbar-brand\" href=\"#\">{{ app.name }}</a>\n    <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"offcanvas\" data-bs-target=\"#offcanvasNavbar\" aria-controls=\"offcanvasNavbar\">\n      <span class=\"navbar-toggler-icon\"></span>\n    </button>\n    <div class=\"offcanvas offcanvas-end\" tabindex=\"-1\" id=\"offcanvasNavbar\" aria-labelledby=\"offcanvasNavbarLabel\">\n      <div class=\"offcanvas-header\">\n        <h5 class=\"offcanvas-title\" id=\"offcanvasNavbarLabel\">{{ foo.bar.baz }}</h5>\n        <button type=\"button\" class=\"btn-close text-reset\" data-bs-dismiss=\"offcanvas\" aria-label=\"Close\"></button>\n      </div>\n      <div class=\"offcanvas-body\">\n        <ul class=\"navbar-nav justify-content-end flex-grow-1 pe-3\">\n          {% for link in links %}\n            <li class=\"nav-item\">\n              <a {{ link.attributes | attr | safe }}>{{ link.label }}</a>\n            </li>\n          {% endfor %}\n        </ul>\n        <form class=\"d-flex\" action=\"/example/search\">\n          <input class=\"form-control me-2\" name=\"q\" type=\"search\" placeholder=\"Search\" aria-label=\"Search\" value=\"{{ request.query.q }}\">\n          <button class=\"btn btn-outline-success\" type=\"submit\">Search</button>\n        </form>\n      </div>\n    </div>\n  </div>\n</nav>","x":130,"y":240,"wires":[]},{"id":"b9a2ff8d07d15421","type":"http response","z":"e78f061152fe82f8","name":"","statusCode":"","headers":{},"x":610,"y":80,"wires":[]},{"id":"b3f6875fd13c8c43","type":"nunjucks_render","z":"e78f061152fe82f8","template":"{% extends \"base.html\" %}\n\n{% import \"cards.html\" as cards %}\n\n{% block body %}\n{% call cards.card(card) %}\n  \n{% endcall %}\n{% endblock %}","x":480,"y":80,"wires":[["b9a2ff8d07d15421"]]},{"id":"f9ba36f6f0a1145a","type":"function","z":"e78f061152fe82f8","name":"payload","func":"global.get('nj.addGlobal')('request', msg.req)\n\nmsg.payload = {\n    card: {\n        title: 'Search results',\n        text: `Searching for ${msg.req.query.q || ''}`,\n    }\n}\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":340,"y":80,"wires":[["b3f6875fd13c8c43"]]},{"id":"599b7390c55080e2","type":"http in","z":"e78f061152fe82f8","name":"","url":"/example/search","method":"get","upload":false,"swaggerDoc":"","x":160,"y":80,"wires":[["f9ba36f6f0a1145a"]]},{"id":"4cf30c301712f9c8","type":"function","z":"e78f061152fe82f8","name":"Nunjucks Global Context","func":"const _context = {\n    app: {\n        name: 'Nunjucks for Node-RED'\n    },\n    links: [{\n        label: 'Random Joke',\n        attributes: {\n            'class': 'nav-link',\n            'href': '/example/joke'\n        }\n    }]\n}\n\nObject.entries(_context).forEach(([key, value]) => {\n    global.get('nj.addGlobal')(key, value)\n})\n\n","outputs":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":350,"y":420,"wires":[]},{"id":"7f7ef0cd9623ebab","type":"inject","z":"e78f061152fe82f8","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":true,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":150,"y":420,"wires":[["4cf30c301712f9c8"]]},{"id":"2076215c31136a97","type":"function","z":"e78f061152fe82f8","name":"More Nunjucks Global Context","func":"const _context = {\n    foo: {\n        bar: {\n            baz: 'Hello Baz!'\n        }\n    }\n}\n\nObject.entries(_context).forEach(([key, value]) => {\n    global.get('nj.addGlobal')(key, value)\n})\n\n","outputs":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":370,"y":460,"wires":[]},{"id":"ce4d3011a50a78ce","type":"inject","z":"e78f061152fe82f8","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":true,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":150,"y":460,"wires":[["2076215c31136a97"]]},{"id":"df10be42375fbc1e","type":"function","z":"e78f061152fe82f8","name":"Filters Example","func":"function myFilter(value) {\n    return `This is myFilter: ${value.toUpperCase()}!!!`\n}\n\nfunction attr(value) {\n    return Object.entries(value).reduce((prev, [key, value]) => {\n        prev.push(`${key}=\"${value}\"`)\n\n        return prev\n    }, []).join(' ')\n}\n\nglobal.get('nj.addFilter')('myFilter', myFilter)\nglobal.get('nj.addFilter')('attr', attr)","outputs":0,"noerr":0,"initialize":"","finalize":"","libs":[],"x":320,"y":560,"wires":[]},{"id":"49bd7037b1599555","type":"inject","z":"e78f061152fe82f8","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":true,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":150,"y":560,"wires":[["df10be42375fbc1e"]]}]
```
