(() => {
    DataManager.maxSavefiles = function() {
        return 5; // Change to your desired number
    };

    // Force Savefile window to update with new limit
    const _Scene_File_createListWindow = Scene_File.prototype.createListWindow;
    Scene_File.prototype.createListWindow = function() {
        _Scene_File_createListWindow.call(this);
        this._listWindow._maxItems = DataManager.maxSavefiles(); // Ensure update
        this._listWindow.refresh();
    };
})();
