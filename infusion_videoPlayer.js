/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid, phpVars*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var infusion_vp = infusion_vp || {};

(function ($) {

    fluid.defaults("infusion_vp.videoPlayerPlugin", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        components: {
            testTrackList: {
                type: "infusion_vp.videoPlayerPlugin.trackList",
                container: ".infvpc-trackList-test",
                options: {
                    // can we really share an applier?? the form fields don't match up
//                    applier: "{videoPlayerPlugin}.applier",
                    supportedValues: {
                        languageCodes: ["es", "md", "kg"],
                        languageNames: ["Spanish", "Mandarin", "Klingon"],
                        types: ["foo", "bar"],
                        typeLabels: ["Foo Format", "Bar Format"],
                    },
                    styles: {
                        foo: "infvp-trackList-urlForm",
                        bar: "infvp-trackList-uploadedFileForm"
                    },
                }
            }
        },
        renderOnInit: true,
        rendererOptions: {
//debugMode: true,
            autoBind: true
        },
        preInitFunction: "infusion_vp.videoPlayerPlugin.preInit",
        finalInitFunction: "infusion_vp.videoPlayerPlugin.finalInit",
        model: {
            sources: [],
            captions: [],
            transcripts: [],

            // initialize some defaults
            videoFormat: "video/webm",
            captionsFormat: "text/amarajson",
            captionsLang: "en",
            transcriptsFormat: "text/amarajson",
            transcriptsLang: "en"
        },
        selectors: {
            // selectors for the forms
            videoUrl: "#infvpc-videoUrl",
            videoTitle: "#infvpc-videoTitle",
            videoFormat: "#infvpc-videoFormat",
            videoFormatListRow: ".infvpc-videoFormatList-row",
            videoFormatListRowUrl: ".infvpc-videoFormatList-url",
            videoFormatListRowFormat: ".infvpc-videoFormatList-format",
            addThisVideoFormat: ".infvpc-addThisVideoFormat",
            "infvpc-captionLang": "#infvpc-captionLang",
            transcriptUrl: "#infvpc-transcriptUrl",
            transcriptName: "#infvpc-transcriptName",
            "infvpc-transcriptLang": "#infvpc-transcriptLang",

            // TODO: Really need to remove all the duplication around captions vs transcripts
            captionUrl: "#infvpc-captionUrl",
            captionName: "#infvpc-captionName",
            captionListRow: ".infvpc-captionList-row",
            captionListRowName: ".infvpc-captionList-name",
            captionListRowLang: ".infvpc-captionList-lang",
            captionListRowFormat: ".infvpc-captionList-format",
            captionFormatForm: ".infvpc-captionFormatForm",
            captionFormAmara: ".infvpc-captionFormAmara",
            captionFormVtt: ".infvpc-captionFormVtt",
            captionFormatChooserRow: ".infvpc-captionFormatChooserRow",
            captionFormatChooserButton: ".infvpc-captionFormatChooser",
            captionFormatChooserLabel: ".infvpc-captionFormatChooserLabel",
            addThisCaption: ".infvpc-addThisCaption",
            deleteCaption: ".infvpc-deleteCaption",

            transcriptListRow: ".infvpc-transcriptList-row",
            transcriptListRowName: ".infvpc-transcriptList-name",
            transcriptListRowLang: ".infvpc-transcriptList-lang",
            transcriptListRowFormat: ".infvpc-transcriptList-format",
            transcriptFormatChooserRow: ".infvpc-transcriptFormatChooserRow",
            transcriptFormatChooserButton: ".infvpc-transcriptFormatChooser",
            transcriptFormatChooserLabel: ".infvpc-transcriptFormatChooserLabel",

            // other selectors
            deleteVideoFormat: ".infvpc-deleteVideoFormat",
            transcriptFormatForm: ".infvpc-transcriptFormatForm",
            transcriptFormAmara: ".infvpc-transcriptFormAmara",
            transcriptFormVtt: ".infvpc-transcriptFormVtt",
            addThisTranscript: ".infvpc-addThisTranscript",
            deleteTranscript: ".infvpc-deleteTranscript",
            insertIntoPost: ".infvpc-insert"
        },
        repeatingSelectors: ["captionFormatChooserRow", "transcriptFormatChooserRow", "videoFormatListRow", "captionListRow", "transcriptListRow"],
        selectorsToIgnore: ["deleteVideoFormat", "captionFormatForm", "transcriptFormatForm",
                            "addThisCaption", "deleteCaption", "addThisTranscript", "addThisVideoFormat", "deleteTranscript",
                            "insertIntoPost"],
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
        },
        supportedValues: {
            languageCodes: ["en", "fr", "es"],
            languageNames: ["English", "French", "Spanish"],
            videoFormats: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"],
            videoFormatNames: ["video/webm", "video/mp4", "video/ogg", "video/ogv", "video/youtube"],
            captionFormats: ["text/amarajson", "text/vtt"],
            captionFormatNames: ["Amara", "VTT"],
            transcriptFormats: ["text/amarajson", "JSONcc"],
            transcriptFormatNames: ["Amara", "JSONcc"],
        }
    });

    infusion_vp.videoPlayerPlugin.produceTree = function (that) {
        var tree = {
            videoTitle: "${videoTitle}",
            videoUrl: "${videoUrl}",
            videoFormat: {
                selection: "${videoFormat}",
                optionlist: that.options.supportedValues.videoFormats,
                optionnames: that.options.supportedValues.videoFormatNames
            },
            expander: [{
                type: "fluid.renderer.selection.inputs",
                rowID: "captionFormatChooserRow",
                labelID: "captionFormatChooserLabel",
                inputID: "captionFormatChooserButton",
                selectID: "captionFormatChooser",
                tree: {
                    selection: "${captionsFormat}",
                    optionlist: that.options.supportedValues.captionFormats,
                    optionnames: that.options.supportedValues.captionFormatNames
                }
            }, {
                type: "fluid.renderer.selection.inputs",
                rowID: "transcriptFormatChooserRow",
                labelID: "transcriptFormatChooserLabel",
                inputID: "transcriptFormatChooserButton",
                selectID: "transcriptFormatChooser",
                tree: {
                    selection: "${transcriptsFormat}",
                    optionlist: that.options.supportedValues.transcriptFormats,
                    optionnames: that.options.supportedValues.transcriptFormatNames
                }
            }, {
                type: "fluid.renderer.repeat",
                repeatID: "videoFormatListRow",
                controlledBy: "sources",
                pathAs: "videoFormat",
                tree: {
                    videoFormatListRowUrl: "${{videoFormat}.src}",
                    videoFormatListRowFormat: "${{videoFormat}.format}"
                }
            }, {
                type: "fluid.renderer.repeat",
                repeatID: "captionListRow",
                controlledBy: "captions",
                pathAs: "caption",
                tree: {
                    captionListRowName: "${{caption}.src}",
                    captionListRowLang: "${{caption}.lang}",
                    captionListRowFormat: "${{caption}.format}"
                }
            }, {
                type: "fluid.renderer.repeat",
                repeatID: "transcriptListRow",
                controlledBy: "transcripts",
                pathAs: "transcript",
                tree: {
                    transcriptListRowName: "${{transcript}.src}",
                    transcriptListRowLang: "${{transcript}.lang}",
                    transcriptListRowFormat: "${{transcript}.format}"
                }
            }],
            captionUrl: "${captionsUrl}",
            "infvpc-captionLang": {
                selection: "${captionsLang}",
                optionlist: that.options.supportedValues.languageCodes,
                optionnames: that.options.supportedValues.languageNames
            },
            captionName: {
                selection: "${captionsName}",
                optionlist: "${captionFileUrls}",
                optionnames: "${captionFileNames}"
            },
            transcriptUrl: "${transcriptsUrl}",
            "infvpc-transcriptLang": {
                selection: "${transcriptsLang}",
                optionlist: that.options.supportedValues.languageCodes,
                optionnames: that.options.supportedValues.languageNames
            },
            transcriptName: {
                selection: "${transcriptsName}",
                optionlist: "${transcriptFileUrls}",
                optionnames: "${transcriptFileNames}"
            }
        };
        return tree;
    };

    infusion_vp.videoPlayerPlugin.bindDeleteButtons = function (that) {
        fluid.each(that.locate("captionListRow"), function (row, index) {
            var delButton = that.locate("deleteCaption", row);
            var rowUrl = that.locate("captionListRowName", row).text();
            delButton.attr("value", index);
            delButton.click(function () {
                var newList = fluid.copy(that.model.captions);
                newList.splice(delButton.attr("value"), 1);
                that.applier.requestChange("captions", newList);
                that.refreshView();
                infusion_vp.videoPlayerPlugin.bindDeleteButtons(that);
            });
        });
    };

    infusion_vp.videoPlayerPlugin.addItemToTrackList = function (that, trackType, modelPathsToReset) {
        var trackList = fluid.copy(that.model[trackType]);
        trackList.push({
            lang: that.model[trackType + "Lang"],
            langLabel: $("option:selected", that.locate("infvpc-captionLang")).text().trim(),
            format: that.model[trackType + "Format"],
            src: (that.model[trackType + "Format"] === "text/amarajson" ? that.model[trackType + "Url"] : that.model[trackType + "Name"])
        });
        that.applier.requestChange(trackType, trackList);

        // reset the form
        fluid.each(modelPathsToReset, function (value, key) {
            that.applier.requestChange(key, value);
        });

        // redraw the interface
        that.refreshView();

        // re-bind the delete buttons
        infusion_vp.videoPlayerPlugin.bindDeleteButtons(that);
    };

    infusion_vp.videoPlayerPlugin.bindDOMEvents = function (that) {
        that.locate("insertIntoPost").click(function () {
            infusion_vp.videoPlayerPlugin.insertVideoPlayer(that);
        });

        that.locate("addThisVideoFormat").click(function () {
            var sources = fluid.copy(that.model.sources);
            sources.push({
                src: that.model.videoUrl,
                format: that.model.videoFormat
            });
            that.applier.requestChange("sources", sources);

            // reset the form
            that.applier.requestChange("videoUrl", null);
            that.applier.requestChange("videoFormat", "video/webm");

            // redraw the interface
            that.refreshView();
        });

        // TODO: Need a better way to deal with default formats and languages
        that.locate("addThisCaption").click(function () {
            infusion_vp.videoPlayerPlugin.addItemToTrackList(that, "captions", {
                "captionsLang": "en",
                "captionsFormat": "text/amarajson",
                "captionsUrl": null,
                "captionsName": null
            });
        });
        that.locate("addThisTranscript").click(function () {
            infusion_vp.videoPlayerPlugin.addItemToTrackList(that, "transcripts", {
                "transcriptsLang": "en",
                "transcriptsFormat": "text/amarajson",
                "transcriptsUrl": null,
                "transcriptsName": null
            });
        });

        that.applier.guards.addListener("sources", infusion_vp.videoPlayerPlugin.validateUrl);
        that.applier.guards.addListener("captions", infusion_vp.videoPlayerPlugin.validateUrl);
        that.applier.guards.addListener("transcripts", infusion_vp.videoPlayerPlugin.validateUrl);

        that.applier.modelChanged.addListener("captionsFormat", function (model, oldModel, changeRequest) {
            that.locate("captionFormatForm").removeClass(that.options.styles.captionForm[oldModel.captionsFormat]).addClass(that.options.styles.captionForm[model.captionsFormat]);
        });
        that.applier.modelChanged.addListener("transcriptsFormat", function (model, oldModel, changeRequest) {
            that.locate("transcriptFormatForm").removeClass(that.options.styles.transcriptForm[oldModel.transcriptsFormat]).addClass(that.options.styles.transcriptForm[model.transcriptsFormat]);
        });
    };

    /*
     * Check that the URL field of the object being added to the array is not empty
     */
    infusion_vp.videoPlayerPlugin.validateUrl = function (model, changeRequest) {
        if ((changeRequest.value.length > 0) && (!changeRequest.value[changeRequest.value.length - 1].src)) {
            // need to fire something that will trigger a message; need to distinguish which field
            console.log("sorry, you need to specify an URL for this");
            return false;
        }
    };

    infusion_vp.videoPlayerPlugin.preInit = function (that) {
        // these are currently arrays of string file names
        that.model.captionFileNames = phpVars.captionFileNames;
        that.model.captionFileUrls = phpVars.captionFileUrls;
        that.model.transcriptFileNames = phpVars.transcriptFileNames;
        that.model.transcriptFileUrls = phpVars.transcriptFileUrls;

        // TODO: This is a hack: need a better solution
        if (that.model.captionFileNames.length === 0) {
            that.model.captionFileNames = ["No caption files uploaded yet"];
            that.model.captionFileUrls = ["nothing here yet"];
        }
        if (that.model.transcriptFileNames.length === 0) {
            that.model.transcriptFileNames = ["No transcript files uploaded yet"];
            that.model.transcriptFileUrls = ["nothing here yet"];
        }

        that.model.captionsName = that.model.captionFileUrls[0];
        that.model.transcriptsName = that.model.transcriptFileUrls[0];
    };

    infusion_vp.videoPlayerPlugin.finalInit = function (that) {

    };

    infusion_vp.videoPlayerPlugin.insertVideoPlayer = function (that) {
        if (that.model.sources.length === 0) {
            // need to fire something that will trigger a message
            console.log("You must provide at least one video URL.");
            return;
        }

        var opts = {
            videoTitle: that.model.videoTitle,
            video: {
                sources: [],
                captions: [],
                transcripts: []
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
        fluid.each(that.model.sources, function (entry, index) {
            opts.video.sources[index] = {
                src: entry.src,
                type: entry.format
            };
        });
        fluid.each(that.model.captions, function (entry, index) {
            opts.video.captions[index] = {
                src: entry.src,
                type: entry.format,
                srclang: entry.lang,
                label: entry.langLabel
            };
        });
        fluid.each(that.model.transcripts, function (entry, index) {
            opts.video.transcripts[index] = {
                src: entry.src,
                type: entry.format,
                srclang: entry.lang,
                label: entry.langLabel
            };
        });

        var htmlString = "<div class='infvpc-video-player'></div>\n<script>";
        htmlString += "var opts = " + fluid.prettyPrintJSON(opts) + ";\n";
        htmlString += "fluid.videoPlayer('.infvpc-video-player', opts);";
        htmlString += "</script>";

        parent.send_to_editor(htmlString);
    };

    /**************************************************************************************
     * Track List subcomponent
     **************************************************************************************/
    fluid.defaults("infusion_vp.videoPlayerPlugin.trackList", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        renderOnInit: true,
        rendererOptions: {
//debugMode: true,
            autoBind: true
        },

        model: {
            tracks: [], // actual list of track data adde by user
            src: "", // url or filename
            type: "", // format
            srclang: "", // language
            label: "", // ??
        },

        listeners: {
            afterRender: {
                listener: "infusion_vp.videoPlayerPlugin.trackList.bindDOMEvents",
                args: ["{trackList}"]
            }
        },

        selectors: {
            // list of tracks
            trackList: ".infvpc-trackList",
            trackRow: ".infvpc-trackList-trackRow",
            trackDelete: ".infvpc-trackList-trackDelete",
            trackSrc: ".infvpc-trackList-trackSrc",
            trackLang: ".infvpc-trackList-trackLang",
            trackFormat: ".infvpc-trackList-trackFormat",

            // track format selection radio buttons
            formatRow: ".infvpc-trackList-formatRow",
            formatLabel: ".infvpc-trackList-formatLabel",
            formatInput: "#infvpc-trackList-formatInput",

            // type-specific forms
            formatForm: ".infvpc-trackList-formatform",

            // track specifics
            srcInputUrl: "#infvpc-trackList-srcInputUrl",
            srcInputFile: "#infvpc-trackList-srcInputFile",
            srcLangInput: "#srcLangInput",  // TODO: This is a problem - not unique on a page! how to make unique? Renderer assigns...

            // buttons
            addTrack: ".infvpc-trackList-addTrack",

            // ????
/*
            urlForm: ".infvpc-trackList-urlForm",
            uploadedFileForm: ".infvpc-trackList-uploadedFileForm",
            src: ".infvp-trackList-src",
            type: ".infvp-trackList-type",
            srclang: ".infvp-trackList-lang",
            label: ".infvp-trackList-lang",
*/
dummy: "foo"
        },
        repeatingSelectors: ["formatRow", "trackRow"],
        selectorsToIgnore: ["trackList", "formatForm", "addTrack", "deleteTrack", "dummy"],

        preInitFunction:  "infusion_vp.videoPlayerPlugin.trackList.preInit",
        // finalInitFunction:  "infusion_vp.videoPlayerPlugin.trackList.finalInit",
        produceTree: "infusion_vp.videoPlayerPlugin.trackList.produceTree"

        // options that will need to be provided or overridden by parent component:
        // supportedValues: {
            // languageCodes
            // languageLabels
            // types
            // typeLabels
        // }
        // styles: one per supported type, key must equal type value
        // styles: {
            // urlForm: "infvp-trackList-urlForm",
            // uploadedFileForm: "infvp-trackList-uploadedFileForm"
        // },

    });

    infusion_vp.videoPlayerPlugin.trackList.preInit = function (that) {
        that.model.type = that.options.supportedValues.types[0];
        // need to also fill in any vars from the PHP data - how to know which ones?
    };

    infusion_vp.videoPlayerPlugin.trackList.addTrackToList = function (that, modelPathsToReset) {
        var trackList = fluid.copy(that.model.tracks);
        trackList.push({
            lang: that.model.srclang,
            langLabel: $("option:selected", that.locate("srcLangInput")).text().trim(),
            format: that.model.type,
            src: that.model.src
        });
        that.applier.requestChange("tracks", trackList);

        // reset the form
        fluid.each(modelPathsToReset, function (value, key) {
            that.applier.requestChange(key, value);
        });

        // redraw the interface
        that.refreshView();
    };

    infusion_vp.videoPlayerPlugin.trackList.bindDOMEvents = function (that) {
        that.applier.modelChanged.addListener("type", function (model, oldModel, changeRequest) {
            that.locate("formatForm").removeClass(that.options.styles[oldModel.type]).addClass(that.options.styles[model.type]);
        });

        that.locate("addTrack").click(function () {
            infusion_vp.videoPlayerPlugin.trackList.addTrackToList(that, {
                src: "",
                type: that.options.supportedValues.types[0],
                srclang: that.options.supportedValues.languageCodes[0],
                label: "this is the label" // what the heck is this??
            });
        });
    };

    infusion_vp.videoPlayerPlugin.trackList.produceTree = function (that) {
        var tree = {
            srcInputUrl: "${src}", // used for Amara url
            srcInputFile: { // used for uploaded file name
                selection: "${src}",
                optionlist: ["file1", "file2"],
                optionnames: ["File 1 Name", "File 2 Name"]
            },
            srcLangInput: {
                selection: "${srclang}",
                optionlist: that.options.supportedValues.languageCodes,
                optionnames: that.options.supportedValues.languageNames
            },
            expander: [{
                type: "fluid.renderer.selection.inputs", // format selector radio buttons
                rowID: "formatRow",
                labelID: "formatLabel",
                inputID: "formatInput",
                selectID: "format",
                tree: {
                    selection: "${type}",
                    optionlist: that.options.supportedValues.types,
                    optionnames: that.options.supportedValues.typeLabels
                }
            }, {
                type: "fluid.renderer.repeat", // list of tracks
                repeatID: "trackRow",
                controlledBy: "tracks",
                pathAs: "track",
                tree: {
                    trackSrc: "${{track}.src}",
                    trackLang: "${{track}.langLabel}",
                    trackFormat: "${{track}.format}"
                }
            }]
        };
        return tree;
    };

})(jQuery);
