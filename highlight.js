var HighlightMode = {
    None : 'none',
    Hover : 'hover',
    Select : 'select'
};

// TODO: inherit from Object3D, make it object.makeHighlightable() { if Box ... etc. }
function makeObjectHighlightable(obj, hoverColor, selectionColor)
{
    obj.highlightable = true;
    obj.highlight[HighlightMode.Hover] = false;
    obj.highlight[HighlightMode.Select] = false;

    obj.hover = function() {

    };
    obj.unhover = function() {

    };
    obj.select = function() {

    };
    obj.deselect = function() {

    };
}

function isObjectHighlightable(obj)
{
    return obj.highlightable;
}

exports.HighlightMode = HighlightMode;
exports.makeObjectHighlightable = makeObjectHighlightable;
exports.isObjectHighlightable = isObjectHighlightable;
