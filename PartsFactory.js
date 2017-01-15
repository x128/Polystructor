class Element {
    init() {
        console.log('hi');
    }
}

class Corner extends Element {
    init() {
        super.init()
        console.log('corner');
    }
}

function freeform(geometry, color, isSelectable, selectionColor, highlightColor) {
    var material = new THREE.MeshPhongMaterial({ color : color });
    var part = new THREE.Mesh(geometry, material);
    part.onSelected = false;
    
    part.isSelectable = isSelectable;
    if (isSelectable) {
        part.isSelected = false;
        part.originalMaterial = material;
        part.selectionMaterial = new THREE.MeshPhongMaterial({ color : selectionColor });

        if (!highlightColor)
            highlightColor = Utils.averageColor(color, selectionColor);
        part.highlightMaterial = new THREE.MeshPhongMaterial({ color : highlightColor });

        part.select = function() {
            this.material = this.selectionMaterial;
            this.isSelected = true;
            console.log(this);
            if (part.onSelected)
                part.onSelected();
        };
        part.deselect = function() {
            this.material = this.originalMaterial;
            this.isSelected = false;
        };

        part.highlight = function() {
            this.material = this.isSelected ? this.selectionMaterial : this.highlightMaterial;
            this.highlighted = true;
        };
        part.fadetoblack = function() {
            this.material = this.isSelected ? this.selectionMaterial : this.originalMaterial;
            this.highlighted = false;
        };
    }

    part.castShadow = true;
    part.receiveShadow = true; // TODO-2016

    return part;
}

function box(width, height, depth, color, isSelectable, selectionColor, highlightColor) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    return freeform(geometry, color, isSelectable, selectionColor, highlightColor);
}

exports.freeform = freeform;
exports.box = box;
exports.Element = Element;
exports.Corner = Corner;
