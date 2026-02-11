/*:
 * @plugindesc Removes Guard command and hides Attack command until TP is full. v1.1
 * @author PixelSkunk
 * @help 
 * This plugin removes the Guard command from the battle menu by overriding its addition.
 * It also hides the Attack command until the actor's TP is full (100 TP).
 */
(function() {

    // Completely remove Guard
    Window_ActorCommand.prototype.addGuardCommand = function() {
        // Nothing. No Guard.
    };

    // Modify Attack to require full TP
    Window_ActorCommand.prototype.addAttackCommand = function() {
        if (this._actor && this._actor.tp >= this._actor.maxTp()) {
            this.addCommand(TextManager.attack, 'attack', this._actor.canAttack());
        }
    };

})();