let currentChapterId = 0;

let fontStyleSizes = [];

let fontStyleSizeIndex = null;

import { chapters } from "./chapters.js";

$(document).ready(
    () => {
        try
        {
            $("button#information").on("click", (event) => {
                $("div#information-dialog").dialog({
                    title: "Information",
                    modal: true,
                    width: "80%",
                    height: "auto"
                });
            });

            $("body").on("click", (event) => {
                if ($(event.target).is("div#information-dialog") || $(event.target).is(".ui-widget-overlay") || $(event.target).is("div#information-dialog p")) {
                    $("div#information-dialog").dialog("close");
                }
            });

            let newContent = "";

            chapters.forEach((chapter, idx) => {
                const chapterNumber = (idx < 2 || idx === chapters.length - 1) ? "&nbsp;" : (idx - 1).toString();

                newContent += `<dt>${chapterNumber}</dt><dd><a class="show-chapter" attrId="${idx}">${chapter.title}</a></dd>`;
            });

            $("div#accordion dl.toc").append(newContent);

            $("#accordion").accordion({"collapsible": true, "active": false});

            $(".show-chapter").on("click", (event) => {
                event.preventDefault();

                changeChapter(parseInt($(event.target).attr("attrId")));
            })

            $("button#prev").on("click", (event) => changeChapter(currentChapterId - 1));

            $("button#next").on("click", (event) => changeChapter(currentChapterId + 1));

            $("input#fontSizeSlider").on(
                "input",
                (event) => {
                    const fontSize = parseInt($(event.target).val());

                    changeFontSize(fontSize);
                }
            );

            setPreferencesOnLoad();
            createFontStyles();
        } catch (error) {
            alert(error);
        }
    }
);

const createFontStyles = () => {
    let fontStyles = "";

    for (let idx = 0; idx <= 50; idx++) {
        const fontSize = Math.round((1.25 - (1.25 * (idx / 100))) * 1000) / 1000;

        fontStyles += `div#chapter-content.font-minus-${idx.toString()}-percent { font-size: ${fontSize}em; }\n`;

        fontStyleSizes.push(`font-minus-${idx.toString()}-percent`);
    }

    fontStyleSizeIndex = fontStyleSizes.length;

    fontStyleSizes.push();

    for (let idx = 1; idx <= 50; idx++) {
        const fontSize = Math.round((1.25 + (1.25 * (idx / 100))) * 1000) / 1000;

        fontStyles += `div#chapter-content.font-plus-${idx.toString()}-percent { font-size: ${fontSize}em; }\n`;

        fontStyleSizes.push(`font-plus-${idx.toString()}-percent`);
    }

    const style = document.createElement("style");

    style.textContent = fontStyles;

    document.head.append(style);
};

const changeFontSize = (fontSize) => {
    if (fontSize === 0) {
        return;
    }

    const newFontClass = `font-${fontSize < 0 ? "minus" : "plus"}-${Math.abs(fontSize)}-percent`;

    setFontSizeClass(newFontClass);
};

const setFontSizeClass = (fontClass) => {
    if (fontStyleSizes.includes(fontClass)) {
        $("div#chapter-content").attr("class", fontClass);

        localStorage.setItem("fontClass", newFontClass);
    } else {
        console.warn(`Font class "${fontClass}" not found in available font styles.`);
    }
}

const changeChapter = (chapterId, titleOverwrite = null) => {
    if (chapterId < 0 || chapterId >= chapters.length) {
        return;
    }

    currentChapterId = chapterId;

    $("div#chapter-content").html(chapters[chapterId].body + "<br><br><br><br><br><br>");

    $("div#content-container").animate({ scrollTop: 0 }, "slow");

    const title = (titleOverwrite !== null) ? titleOverwrite : chapters[chapterId].title;

    $("#accordion h3").html("≡ " + title);

    $("#accordion").accordion("option", "active", false);

    $("button#prev").css("opacity", (chapterId === 0) ? "0.2" : "1.0");

    $("button#next").css("opacity", (chapterId === chapters.length - 1) ? "0.2" : "1.0");

    localStorage.setItem("currentChapterId", chapterId);
};

const setPreferencesOnLoad = () => {
    const storedChapterId = localStorage.getItem("currentChapterId") ?? 0;

    const storedFontClass = localStorage.getItem("fontClass") ?? "";

    changeChapter(parseInt(storedChapterId), "Living Sober");

    $("div#chapter-content").addClass(storedFontClass);
};
