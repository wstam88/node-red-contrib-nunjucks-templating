const nunjucks = require("nunjucks");
const fs = require("fs");

class NodeTemplateLoader {
    constructor(templates, folders=['templates']) {
        this.async = false;
        this.templates = templates;
        this.folders = folders;
    }

    resolve(parentName, filename) {
        return filename;
    }

    getSource(filePath) {
        if(this.templates[filePath]) {
            return {
                src: this.templates[filePath],
                path: filePath,
                noCache: true
            };
        } else{
            for (let folder of this.folders) {
                const path = `${folder}/${filePath}`;

                if(fs.existsSync(path)) {
                    return {
                        src: fs.readFileSync(path, "utf8"),
                        path: filePath,
                        noCache: true,
                    }
                }
            }            
        }

        return null;
    }
}

module.exports = function (RED) {
    let filters = {};
    let extensions = {};
    let globals = {};

    const addFilter = (name, filter) => {
        filters[name] = filter;
    };

    const getFilter = (name) => {
        return filters[name];
    }

    const addExtension = (name, extension) => {
        extensions[name] = extension;
    }

    const getExtension = (name) => {
        return extensions[name];
    }

    const removeExtension = (name) => {
        delete extensions[name];
    }

    const hasExtension = (name) => {
        return extensions[name] !== undefined;
    }

    const getTemplate = (templates, name) => {
        return templates[name];
    }

    const addGlobal = (name, value) => {
        globals[name] = value;
    }

    const getGlobal = (name) => {
        return globals[name];
    }

    const renderString = (template, context) => {
        return nunjucks.renderString(template, context);
    }

    function nunjucks_render(config) {
        RED.nodes.createNode(this, config);

        const node = this;
        const globalContext = this.context().global;
        const templates = {};
        const settings = RED.settings.nunjucks;

        filters = {};
        extensions = {};
        globals = {};

        globalContext.set("nj.addFilter", addFilter);
        globalContext.set("nj.getFilter", getFilter);
        globalContext.set("nj.addExtension", addExtension);
        globalContext.set("nj.getExtension", getExtension);
        globalContext.set("nj.hasExtension", hasExtension);
        globalContext.set("nj.removeExtension", removeExtension);
        globalContext.set("nj.getTemplate", (name) => getTemplate(templates, name));
        globalContext.set("nj.addGlobal", addGlobal);
        globalContext.set("nj.getGlobal", getGlobal);
        globalContext.set("nj.renderString", renderString);

        node.on("input", function (msg) {
            RED.nodes.eachNode(function (n) {
                if (n.type === "nunjucks") {
                    templates[n.name] = n.template;
                }
            });

            const env = new nunjucks.Environment(
                new NodeTemplateLoader(templates, settings?.folders),
                settings.options || {}
            );
            
            Object.entries(filters).forEach(([name, filter]) => env.addFilter(name, filter))
            Object.entries(extensions).forEach(([name, ext]) => env.addExtension(name, ext))
            Object.entries(globals).forEach(([name, value]) => env.addGlobal(name, value))

            try {
                msg.payload = env.renderString(config.template, {
                    ...settings?.globals || {},
                    ...msg.payload
                });
            } catch(err) {
                msg.payload = err.message;
            }

            node.send(msg);
        });
    }
    RED.nodes.registerType("nunjucks_render", nunjucks_render);
};
