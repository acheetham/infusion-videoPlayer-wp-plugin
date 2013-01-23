/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, window, fluid*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var infusion_vp = infusion_vp || {};

(function ($) {

    fluid.defaults("infusion_vp.videoPlayerPlugin", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        renderOnInit: true,
        rendererOptions: {
            autoBind: true,
debugMode: true
        },
        preInitFunction: "infusion_vp.videoPlayerPlugin.preInit",
        finalInitFunction: "infusion_vp.videoPlayerPlugin.finalInit",
        model: {
            videoFormats: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"],
            videoFormatNames: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"],
            languageCodes: ["en", "fr", "es"],
            languageNames: ["English", "French", "Spanish"],
            captionLang: "en",
            transcriptLang: "en",
            captionFormats: ["text/amarajson", "text/vtt"],
            captionFormatNames: ["Amara", "VTT"],
            captionFormat: "text/amarajson",
            transcriptFormats: ["text/amarajson", "JSONcc"],
            transcriptFormatNames: ["Amara", "JSONcc"],
            transcriptFormat: "text/amarajson"
        },
        selectors: {
            // selectors for the form
            videoUrl: "#infvpc-videoUrl",
            videoTitle: "#infvpc-videoTitle",
            videoFormat: "#infvpc-videoFormat",
            captionUrl: "#infvpc-captionUrl",
            captionName: "#infvpc-captionName",
            "infvpc-captionLang": "#infvpc-captionLang",
            transcriptUrl: "#infvpc-transcriptUrl",
            transcriptName: "#infvpc-transcriptName",
            "infvpc-transcriptLang": "#infvpc-transcriptLang",
            transcriptList: ".infvpc-transcriptList",

            // TODO: Need to remove all the duplication around captions vs transcripts
            captionFormatChooserRow: ".infvpc-captionFormatChooserRow",
            captionFormatChooserButton: ".infvpc-captionFormatChooser",
            captionFormatChooserLabel: ".infvpc-captionFormatChooserLabel",
            transcriptFormatChooserRow: ".infvpc-transcriptFormatChooserRow",
            transcriptFormatChooserButton: ".infvpc-transcriptFormatChooser",
            transcriptFormatChooserLabel: ".infvpc-transcriptFormatChooserLabel",

            // other selectors
            captionList: ".infvpc-captionList",
            addAnotherCaption: ".infvpc-addAnotherCaption",
            captionTemplate: ".infvpc-captionTemplate",
            captionFormatForm: ".infvpc-captionFormatForm",
            captionFormAmara: ".infvpc-captionFormAmara",
            captionFormVtt: ".infvpc-captionFormVtt",
            transcriptFormatForm: ".infvpc-transcriptFormatForm",
            transcriptFormAmara: ".infvpc-transcriptFormAmara",
            transcriptFormVtt: ".infvpc-transcriptFormVtt",
            addAnotherTranscript: ".infvpc-addAnotherTranscript",
            insertIntoPost: ".infvpc-insert"
        },
        repeatingSelectors: ["captionFormatChooserRow", "transcriptFormatChooserRow"],
        selectorsToIgnore: ["captionList", "captionTemplate", "captionFormatForm",
                            "transcriptList", "transcriptTemplate", "transcriptFormatForm",
                            "addAnotherTranscript", "insertIntoPost"],
        produceTree: "infusion_vp.videoPlayerPlugin.produceTree",
        styles: {
            captionForm: {
                "text/amarajson":  "infvp-captionFormAmara",
                "text/vtt":  "infvp-captionFormVtt"
            },
            transcriptForm: {
                "text/amarajson":  "infvp-transcriptFormAmara",
                "JSONcc":  "infvp-transcriptFormJson"
            }
        },
        listeners: {
            afterRender: {
                listener: "infusion_vp.videoPlayerPlugin.bindDOMEvents",
                args: ["{videoPlayerPlugin}"]
            }
        }
    });

    infusion_vp.videoPlayerPlugin.produceTree = function (that) {
        var tree = {
            videoTitle: "${videoTitle}",
            videoUrl: "${videoUrl}",
            videoFormat: {
                selection: "${videoFormat}",
                optionlist: "${videoFormats}",
                optionnames: "${videoFormatNames}"
            },
            expander: [{
                type: "fluid.renderer.selection.inputs",
                rowID: "captionFormatChooserRow",
                labelID: "captionFormatChooserLabel",
                inputID: "captionFormatChooserButton",
                selectID: "captionFormatChooser",
                tree: {
                    selection: "${captionFormat}",
                    optionlist: "${captionFormats}",
                    optionnames: "${captionFormatNames}"
                }
            },
            {
                type: "fluid.renderer.selection.inputs",
                rowID: "transcriptFormatChooserRow",
                labelID: "transcriptFormatChooserLabel",
                inputID: "transcriptFormatChooserButton",
                selectID: "transcriptFormatChooser",
                tree: {
                    selection: "${transcriptFormat}",
                    optionlist: "${transcriptFormats}",
                    optionnames: "${transcriptFormatNames}"
                }
            }],
            captionUrl: "${captionUrl}",
            "infvpc-captionLang": {
                selection: "${captionLang}",
                optionlist: "${languageCodes}",
                optionnames: "${languageNames}"
            },
            captionName: {
                selection: "${captionName}",
                optionlist: "${captionFileUrls}",
                optionnames: "${captionFileNames}"
            },
            transcriptUrl: "${transcriptUrl}",
            "infvpc-transcriptLang": {
                selection: "${transcriptLang}",
                optionlist: "${languageCodes}",
                optionnames: "${languageNames}"
            },
            transcriptName: {
                selection: "${transcriptName}",
                optionlist: "${transcriptFileUrls}",
                optionnames: "${transcriptFileNames}"
            }
        };
        return tree;
    };

    infusion_vp.videoPlayerPlugin.bindDOMEvents = function (that) {
        that.locate("insertIntoPost").click(function () {
            infusion_vp.videoPlayerPlugin.insertVideoPlayer(that);
        });

        that.captionTemplate = that.locate("captionTemplate").clone();
        that.locate("addAnotherCaption").click(function () {
            var copy = that.captionTemplate.clone().removeClass("infvpc-captionTemplate"); // *********
            that.locate("captionList").append(copy);
        });

        that.applier.modelChanged.addListener("captionFormat", function (model, oldModel, changeRequest) {
            that.locate("captionFormatForm").removeClass(that.options.styles.captionForm[oldModel.captionFormat]).addClass(that.options.styles.captionForm[model.captionFormat]);
        });
        that.applier.modelChanged.addListener("transcriptFormat", function (model, oldModel, changeRequest) {
            that.locate("transcriptFormatForm").removeClass(that.options.styles.transcriptForm[oldModel.transcriptFormat]).addClass(that.options.styles.transcriptForm[model.transcriptFormat]);
        });
    };

    infusion_vp.videoPlayerPlugin.preInit = function (that) {
        // these are currently arrays of string file names
        that.model.captionFileNames = phpVars.captionFileNames;
        that.model.captionFileUrls = phpVars.captionFileUrls;
        that.model.captionName = that.model.captionFileUrls[0];
        that.model.transcriptFileNames = phpVars.transcriptFileNames;
        that.model.transcriptFileUrls = phpVars.transcriptFileUrls;
        that.model.transcriptName = that.model.transcriptFileUrls[0];
    };

    infusion_vp.videoPlayerPlugin.finalInit = function (that) {

    };

    infusion_vp.videoPlayerPlugin.insertVideoPlayer = function (that) {
        var htmlString = "<div class='infvpc-video-player'></div>\n<script>";
        
        var captionLangLabel = $("option:selected", that.locate("infvpc-captionLang")).text().trim();
        var transcriptLangLabel = $("option:selected", that.locate("infvpc-transcriptLang")).text().trim();
    
        var opts = {
            videoTitle: that.model.videoTitle,
            video: {
                sources: [{
                    src: that.model.videoUrl,
                    type: that.model.videoFormat
                }],
                captions: [{
                    src: that.model.captionUrl,
                    type: that.model.captionFormat,
                    srclang: that.model.captionLang,
                    label: captionLangLabel
                }],
                transcripts: [{
                    src: that.model.transcriptUrl,
                    type: that.model.transcriptFormat,
                    srclang: that.model.transcriptLang,
                    label: transcriptLangLabel
                }]
            },
            templates: {
                videoPlayer: {
                    href: phpVars.pluginUrl + "/lib/videoPlayer/html/videoPlayer_template.html"
                },
                menuButton: {
                    href: phpVars.pluginUrl + "/lib/videoPlayer/html/menuButton_template.html"
                }
            }
        };
        if (that.model.captionFormat === "text/vtt") {
            opts.video.captions[0].src = that.model.captionName;
        }
        if (that.model.transcriptFormat === "JSONcc") {
            opts.video.transcripts[0].src = that.model.transcriptName;
        }

        htmlString += "var opts = " + fluid.prettyPrintJSON(opts) + ";\n";

        htmlString += "fluid.videoPlayer('.infvpc-video-player', opts);";

        htmlString += "</script>";
        parent.send_to_editor(htmlString);
    };
})(jQuery);
