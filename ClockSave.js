//this plugin adds a loading screen with a randomized message and a preset image to your game!
//it was made specific to my game, but you're free to use it with your own graphics!
//Simply change the parameters below to your liking

(function() {
    // Change the Save command text to "Pocket Watch", change the text below based on what you want to do
    const _Window_MenuCommand_addSaveCommand = Window_MenuCommand.prototype.addSaveCommand;
    Window_MenuCommand.prototype.addSaveCommand = function() {
        if (this.needsCommand("save")) {
            this.addCommand("Pocket Watch", "save", this.isSaveEnabled());
        }
    };

    // Override the save command in Scene_Menu to push our custom scene
    Scene_Menu.prototype.commandSave = function() {
        SceneManager.push(Scene_PocketWatchSave);
    };

    // Custom scene for the save animation
    function Scene_PocketWatchSave() {
        this.initialize.apply(this, arguments);
    }
    Scene_PocketWatchSave.prototype = Object.create(Scene_Base.prototype);
    Scene_PocketWatchSave.prototype.constructor = Scene_PocketWatchSave;

    Scene_PocketWatchSave.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };

    Scene_PocketWatchSave.prototype.create = function() {
        Scene_Base.prototype.create.call(this);

        // Fade out the current scene (over 30 frames)
        $gameScreen.startFadeOut(30);

        // Create a full-screen black sprite to cover the scene
        this._blackSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this._blackSprite.bitmap.fillAll("black");
        this.addChild(this._blackSprite);

        // Pick a random save message, change these to whatever you want your save loading screen to say!
        const saveMessages = [
            "The hands tremble for a moment...",
            "The ticking sounds uneven.",
            "Time stops, just for a second...",
            "Over and over, time and time again...",
            "Tick... Tock... Tick... Tock...",
            "Twenty-four hours in a day, sixty minutes in an hour, sixty seconds in a minute...",
            "You swear the second hand moved backwards...?",
            "The watch is warm in your hand.",
            "Time waits for no one.",
            "Again and again and again and again and again..."
        ];
        const messageIndex = Math.floor(Math.random() * saveMessages.length);

        // Create a sprite for the text message
        this._textSprite = new Sprite(new Bitmap(Graphics.width, 100));
        this._textSprite.bitmap.fontSize = 24;
        this._textSprite.bitmap.drawText(saveMessages[messageIndex], 0, 0, Graphics.width, 100, 'center');
        // Position the text sprite at the bottom of the screen
        this._textSprite.y = Graphics.height - 120;
        this.addChild(this._textSprite);

        // Create the loading image sprite
        this._clockSprite = new Sprite();
        this._clockSprite.bitmap = ImageManager.loadPicture("PocketWatch"); //change to your image filename
        // Use fixed values to center the image (assuming 100x100px image, change accordingly)
        this._clockSprite.x = (Graphics.width / 2) - 50;
        this._clockSprite.y = (Graphics.height / 2) - 50;
        this.addChild(this._clockSprite);

        // Play the ticking sound effect, change to the name of whatever sound effect you want to use
        AudioManager.playSe({ name: "Clock_Tick", volume: 80, pitch: 100, pan: 0 });

        // Wait time in frames (150 frames ~2.5 seconds), change this to how long you want the loading screen to linger on screen
        this._waitTime = 150;
    };

    Scene_PocketWatchSave.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        if (this._waitTime > 0) {
            this._waitTime--;
        } else {
            // Fade back in and go to the save scene
            $gameScreen.startFadeIn(30);
            SceneManager.goto(Scene_Save);
        }
    };
})();

