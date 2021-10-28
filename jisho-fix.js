// ==UserScript==
// @name         Jisho.org Jisho-modo
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Slightly rejigger jisho.org search results to improve info density
// @author       slyborg
// @match        https://jisho.org/search/*
// @grant        none
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';
  
  var css = `
    .row,
    .page {
        max-width: 100% !important;
    }
    
    #search {
        max-width: 90% !important;
        margin-left: auto;
        margin-right: auto;
    }
    
    #main_results {
        margin-top: -0.5em;
    }

    .concept_light {
        margin: 0 0 5px 0 !important;
        border-bottom: 1px solid #000000;
    }

    .sentences_block .sentence {
        border-bottom: 1px solid #000;
    }

    .result_count {
        font-weight: bold !important;
        font-size: 1.0em !important;
        color: black !important;
    }
    
    #primary,
    .concept_light-meanings,
    .sentence,
    .concept_light .clearfix {
        margin-top: 2px !important;
        margin-bottom: 1px !important;
    }

    .meaning-definition {
        margin-top: -8px !important;
        margin-bottom: -8px !important;
    }
    
    #the_corrector {
        margin-bottom: 1px !important;
    }
    
    .meaning-tags {
        margin-top: -7px !important;
        margin-bottom: -7px !important;
    }
    
    .break-unit {
        display: inline-block;
        margin-top: 5px;
    }
    
    /* meanings */
    .meaning-meaning {
        font-size: 1.1em !important;
        font-family: 'Times New Roman', Georgia, 'Lucida Grande', Helvetica, Sans-serif !important;
    }

    /* kanji and reading field */
    .concept_light-readings  {
        margin-bottom: -10px !important;

    }

    /* word tags */
    .concept_light-status .concept_light-tag{
        width: auto !important;
    }

    /* links */
    .concept_light-status_link  {
        display: inline !important;
    }
    /* details link */
    .light-details_link {
        font-size: 12px !important;
        padding: 0 1px 1px 0 !important;
        margin-top:-7px !important;
    }
  `
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
  
    const meaningTags = document.querySelectorAll("div.meaning-tags");
    const studylvlTags = document.querySelectorAll("div.concept_light-status > span");
  
    // Number of words found in search
    document.querySelectorAll("h4").forEach(h => {
        if (h.innerHTML.startsWith("Words") || h.innerHTML.startsWith("Names") || h.innerHTML.startsWith("Sentences")) {
            h.style.fontSize = "1.0em";
            h.style.borderBottom = "1px solid #000000";
        }
    });

    // Purge header
    const jishohdr = document.querySelectorAll("header.collapse.row");
    jishohdr.forEach(s => {
        s.style.display = "none";
    });
  
    // Set document container to use the actual page width instead of arbitrarily half of it because idk
    const container = document.querySelectorAll("page_container");
    container.forEach(s => {
        s.style.width = "100%";
    });
  
    // Set primary result display to use full render width
    const Primary = document.querySelectorAll("div#primary");
    Primary.forEach(s => {
        s.setAttribute('class','large-12 columns')
    });
  
    // Purge righthand displays
    const altright = document.querySelectorAll("div#secondary.large-4.columns.search-secondary_column");
    altright.forEach(s => {
        s.style.display = "none";
    });

    // Purge example sentences in search results
    const sentences = document.querySelectorAll("div.sentence");
    sentences.forEach(s => {
        s.style.display = "none";
    });
  
    // Parts of speech purge 
    meaningTags.forEach(s => {
        if( s.innerHTML.startsWith("Other") || (s.innerHTML === "Wikipedia definition")) {
          s.style.display = "inline";
        }
        else {
          s.style.display = "none";
        }
    });

    // Links under the words (play audio, collocations, links)
    const links = document.querySelectorAll("div.concept_light-status > a");
    links.forEach(link => {
        if (link.innerHTML === "Play audio") {
            link.innerHTML = "Audio";
            } else if (link.innerHTML === "Show inflections") {
                link.innerHTML = "Inflections";
            }
    });

    // Hide JLPT level tags
    studylvlTags.forEach(tag => {
        if (tag.innerHTML.startsWith("JLPT")) {
            tag.style.display = "none";
        }
    });

    // Hide WaniKani level tags
    studylvlTags.forEach(tag => {
        if (tag.innerHTML.includes("Wanikani level")) {
            tag.style.display = "none";
        }
    });

    // Hide Notes
    const notes = document.querySelectorAll("div.meaning-representation_notes");
    notes.forEach(note => {
        note.style.display = "none";
    });
  
    meaningTags.forEach(tag => {
        if (tag.innerHTML === "Notes") {
            tag.style.display = "none";
        }
    });

    // Abbreviate Annotations
    const supplementalInfo = document.querySelectorAll("span.sense-tag.tag-tag");
    supplementalInfo.forEach(s => {
        if (s.innerHTML === "Usually written using kana alone") {
            s.innerHTML = "Usually kana";
        } else if (s.innerHTML === "Yojijukugo (four character compound)") {
            s.innerHTML = "Yojijukugo";
        }
    });
    
    // Emphasize row numbers
    // You can change the number color every other row if desired
    const numlabels = document.querySelectorAll("span.meaning-definition-section_divider");  
    var iterator = 1;
    
    numlabels.forEach(lbl => {
        lbl.style.fontWeight = "normal";
        lbl.style.color = "black";
        if ((iterator % 2) == 0) {
            lbl.style.color = "black";
        }
        iterator++;
    });

    // Make colored rows
    const defrow = document.querySelectorAll("div.concept_light.clearfix,li.entry.sentence.clearfix");
    var iterator2 = 1;
  
    defrow.forEach(d => {
        if ((iterator2 % 2) == 0) {
            d.style.backgroundColor = "#effbff";
        }
        iterator2++;
    });
  
})();