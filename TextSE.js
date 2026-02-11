(function() {
    const SCRIBBLE_SE_LIST = ["scribble1", "scribble2", "scribble3"]; // Scribble SE list
    const SCRIBBLE_SE_VOLUME = 100;
    const SCRIBBLE_SE_PITCH = 100;
    const SCRIBBLE_SE_PAN = 0;

    const INTERVAL = 4; // Change how often the sound plays (every X letters)

    let _Window_Message_updateMessage = Window_Message.prototype.updateMessage;
    Window_Message.prototype.updateMessage = function() {
        const prevIndex = this._textState && this._textState.index;
        const result = _Window_Message_updateMessage.call(this);

        if (this._textState && this._textState.index !== prevIndex) {
            if (this._textState.index % INTERVAL === 0) {
                const seName = SCRIBBLE_SE_LIST[Math.floor(Math.random() * SCRIBBLE_SE_LIST.length)];
                AudioManager.playSe({
                    name: seName,
                    volume: SCRIBBLE_SE_VOLUME,
                    pitch: SCRIBBLE_SE_PITCH,
                    pan: SCRIBBLE_SE_PAN
                });
            }
        }

        return result;
    };
})();
