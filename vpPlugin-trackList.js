/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, phpVars*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid = fluid || {};

(function ($) {
    /**************************************************************
     * 
     */
    fluid.defaults("fluid.vpPlugin.trackList", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        preInitFunction: "fluid.vpPlugin.trackList.preInit",
        finalInitFunction: "fluid.vpPlugin.trackList.finalInit",
        mergePolicy: {
            selectors: "replace"
        },
        model: {
            mediaType: {
                tracks: []
            }
        },
        events: {
            onDeleteRow: null
        },
        listeners: {
            onDeleteRow: {
                listener: "fluid.vpPlugin.trackList.deleteRow",
                args: ["{trackList}", "{arguments}.0"]
            }
        },
        selectors: {
            row: ".vppc-trackList-trackRow"
        },
        repeatingSelectors: ["row"],
        produceTree: "fluid.vpPlugin.trackList.produceTree",
        rendererOptions: {
//            debugMode: true,
            autoBind: true
        },
        resources: {
            template: {
                forceCache: true,
                href: phpVars.pluginUrl + "/trackListTemplate.html",
                fetchClass: "template"
            }
        },
        modelPath: "mediaType"
    });
    fluid.fetchResources.primeCacheFromResources("fluid.vpPlugin.trackList");

    fluid.vpPlugin.trackList.preInit = function (that) {
        fluid.fetchResources({}, function (resourceSpec) {
            that.refreshView();
        }, {amalgamateClasses: ["template"]});        
    };

    fluid.vpPlugin.trackList.finalInit = function (that) {
        that.applier.modelChanged.addListener(that.options.modelPath + ".tracks", that.refreshView);
    };

    fluid.vpPlugin.trackList.deleteRow = function (that, index) {
        var newList = fluid.copy(that.model[that.options.modelPath].tracks);
        newList.splice(index, 1);
        that.applier.requestChange(that.options.modelPath + ".tracks", newList);
    };

    fluid.vpPlugin.trackList.produceTree = function (that) {
        var tree = {
            expander: [{
                type: "fluid.renderer.repeat",
                repeatID: "row",
                controlledBy: that.options.modelPath + ".tracks",
                pathAs: "track",
                tree: {
                    decorators: [{
                        type: "fluid",
                        func: "fluid.vpPlugin.trackList.columns",
                        options: {
                            model: that.model,
                            applier: that.applier,
                            modelPath: that.options.modelPath,
                            trackPath: "{track}"
                        }
                    }]
                }
            }]
        };
        return tree;
    };

    /**********************************************************
     * Component to render the columns of a row in a trackList
     **********************************************************/
    fluid.defaults("fluid.vpPlugin.trackList.columns", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        model: {
            fields: []
        },
        events: {
            onDeleteRow: null
        },
        listeners: {
            onDeleteRow: {
                listener: "fluid.vpPlugin.trackList.columns.deleteRow",
                args: ["{columns}"]
            }
        },
        selectors: {
            src: ".vppc-trackList-trackSrc",
            type: ".vppc-trackList-trackType",
            langLabel: ".vppc-trackList-trackLang",
            deleteButton: ".vppc-trackList-trackDelete"
        },

        renderOnInit: true,
        repeatingSelectors: ["column"],
        produceTree: "fluid.vpPlugin.trackList.columns.produceTree",
        rendererOptions: {
//            debugMode: true,
            autoBind: true
        }
    });

    fluid.vpPlugin.trackList.columns.produceTree = function (that) {
        var tree = {
            deleteButton: {
                decorators: [{
                    type: "jQuery",
                    func: "click",
                    args: that.events.onDeleteRow.fire
                }]
            }
        };
        fluid.each(fluid.get(that.model, that.options.modelPath).fields, function (field, index) {
            tree[field] = {
                value: fluid.get(that.model, that.options.trackPath)[field]
            };
        });
        return tree;
    };

    fluid.vpPlugin.trackList.columns.deleteRow = function (that) {
        var newList = fluid.copy(that.model[that.options.modelPath].tracks);
        var index = parseInt(that.options.trackPath.substring(that.options.trackPath.length - 1));
        newList.splice(index, 1);
        that.applier.requestChange(that.options.modelPath + ".tracks", newList);

    };
})(jQuery);
