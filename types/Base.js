/**
 * @abstract
 */
class Base {
    text;
    image;
    options;

    constructor(text, image = null, options = null) {
        this.text = text;
        this.image = image;
        this.options = options;
    }

    trigger() {
        return;
    };

    toJSON(type) {
        return {
            "text": this.text,
            "image": this.image,
            "type": type,
            "options": this.options
        }
    }
}

module.exports = Base;
