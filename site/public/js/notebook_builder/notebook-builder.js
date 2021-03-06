// Attach notebook_builder object to the window
window.addEventListener('DOMContentLoaded', (event) => {
    window.notebook_builder = new NotebookBuilder();
    notebook_builder.render();
});

class NotebookBuilder {
    constructor() {
        // Setup object properties
        this.reorderable_widgets = [];
        this.selector = new SelectorWidget();
        this.form_options = new FormOptionsWidget();

        // Setup fixed position widgets
        const main_div = document.getElementById('notebook-builder');
        main_div.appendChild(this.selector.render());
        main_div.appendChild(this.form_options.render());

        // Load reorderable notebook widgets
        this.load();
    }

    /**
     * Re-render reorderable widgets
     */
    render() {
        // Get a handle on the widgets div
        const widgets_div = document.getElementById('reorderable-widgets');

        // Clear
        widgets_div.innerHTML = '';

        // Draw widgets
        this.reorderable_widgets.forEach(widget => {
            widgets_div.appendChild(widget.render());
        });
    }

    /**
     * From the list of widgets compile and return a 'notebook' json.
     */
    getJSON() {
        const notebook_array = [];

        this.reorderable_widgets.forEach(widget => {
            // Ensure we got something back before adding to the notebook_array
            const widget_json = widget.getJSON();
            if (widget_json) {
                notebook_array.push(widget_json);
            }
        });

        builder_data.config.notebook = notebook_array;
        return builder_data.config;
    }

    load() {
        builder_data.config.notebook.forEach(cell => {
            let widget;

            switch (cell.type) {
                case 'multiple_choice':
                    widget = new MultipleChoiceWidget();
                    break;
                case 'markdown':
                    widget = new MarkdownWidget();
                    break;
                case 'short_answer':
                    widget = new ShortAnswerWidget();
                    break;
                default:
                    break;
            }

            if (widget) {
                widget.load(cell);
                this.widgetAdd(widget);
            }
        });
    }

    /**
     * Add a widget to the notebook builder form.
     *
     * @param {Widget} widget
     */
    widgetAdd(widget) {
        this.reorderable_widgets.push(widget);
        this.render();
    }

    /**
     * Remove a widget from the notebook builder form.
     *
     * @param {Widget} widget
     */
    widgetRemove(widget) {
        const index = this.reorderable_widgets.indexOf(widget);
        this.reorderable_widgets.splice(index, 1);
        this.render();
    }

    /**
     * Move a widget up one position in the notebook builder form.
     *
     * @param {Widget} widget
     */
    widgetUp(widget) {
        const index = this.reorderable_widgets.indexOf(widget);

        // If index is 0 then do nothing
        if (index === 0) {
            return;
        }

        this.reorderable_widgets.splice(index, 1);
        this.reorderable_widgets.splice(index - 1, 0, widget);
        this.render();
    }

    /**
     * Move a widget down one position in the notebook builder form.
     *
     * @param {Widget} widget
     */
    widgetDown(widget) {
        const index = this.reorderable_widgets.indexOf(widget);

        // If widget is already at the end of the form then do nothing
        if (index === this.reorderable_widgets.length - 1) {
            return;
        }

        this.reorderable_widgets.splice(index, 1);
        this.reorderable_widgets.splice(index + 1, 0, widget);
        this.render();
    }
}
