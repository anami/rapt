////////////////////////////////////////////////////////////////////////////////
// class Document
////////////////////////////////////////////////////////////////////////////////

function Document() {
	this.world = new World();
	this.undoStack = new UndoStack();
}

Document.prototype.setCell = function(x, y, type) {
	this.undoStack.push(new SetCellCommand(this.world, x, y, type));
};

Document.prototype.addPlaceable = function(placeable) {
	this.undoStack.push(new AddPlaceableCommand(this.world, placeable));
};

Document.prototype.removePlaceable = function(placeable) {
	this.undoStack.push(new RemovePlaceableCommand(this.world, placeable));
	
	// Also remove all links with deleted buttons and doors
	if (placeable instanceof Button || placeable instanceof Door) {
		var deadLinks = [];
		var i;
		for (i = 0; i < this.world.placeables.length; i++) {
			var link = this.world.placeables[i];
			if (link instanceof Link && (link.button == placeable || link.door == placeable)) {
				deadLinks.push(link);
			}
		}
		for (i = 0; i < deadLinks.length; i++) {
			this.undoStack.push(new RemovePlaceableCommand(this.world, deadLinks[i]));
		}
	}
};

Document.prototype.setSelection = function(selection) {
	// Compare oldSelection and selection
	var oldSelection = this.world.getSelection();
	var sameSelection = (oldSelection.length == selection.length);
	if (sameSelection) {
		for (var i = 0; i < oldSelection.length; i++) {
			var found = false;
			for (var j = 0; j < selection.length; j++) {
				if (oldSelection[i] == selection[j]) {
					found = true;
					break;
				}
			}
			if (found == false) {
				sameSelection = false;
				break;
			}
		}
	}
	
	// Only change the selection if oldSelection and selection are different
	if (!sameSelection) {
		this.undoStack.push(new SetSelectionCommand(this.world, selection));
	}
};

Document.prototype.moveSelection = function(delta) {
	this.undoStack.push(new MoveSelectionCommand(this.world, delta));
};

Document.prototype.rotateSelection = function(deltaAngle) {
	this.undoStack.push(new RotateSelectionCommand(this.world, deltaAngle));
};

Document.prototype.setPlayerStart = function(playerStart) {
	this.undoStack.push(new SetPlayerStartCommand(this.world, playerStart));
};

Document.prototype.setPlayerGoal = function(playerGoal) {
	this.undoStack.push(new SetPlayerGoalCommand(this.world, playerGoal));
};

Document.prototype.toggleInitiallyOpen = function(door) {
	this.undoStack.push(new ToggleInitiallyOpenCommand(door));
};
