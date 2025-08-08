/**
 * We need the ability to create columns with the "incorrect" data.
 * This may be created with multiple days or single days, but the data needs to be
 * built to type, which will require two "interpreters".
 */
class SectionColumns {
    #meetings;

    #template;

    #section;

    #key;

    constructor(meetings, section, key) {
        this.#template = sectionColumnsControlsTemplate;

        this.#meetings = meetings;

        this.#section = section;

        this.#key = key;
    }

    render() {
        const sectionColumnsControlsContentTemplateEngine = Handlebars.compile(this.#template);

        const data = {};

        return sectionColumnsControlsContentTemplateEngine(data);
    }
}