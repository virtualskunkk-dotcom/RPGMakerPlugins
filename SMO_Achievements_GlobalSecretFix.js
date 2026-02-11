/*:
 * @target MV MZ
 * @plugindesc Fixes secret achievements showing their name when Global Mode is enabled.
 * @author VirtualSkunk
 *
 * When SMO_Achievements is used in global mode the dynamic state information
 * stored in the `achievs` save file is reused between games.  If an
 * achievement's visibility is set to “Secret” but no entry for it exists
 * in the global data, its state defaults to 0 (locked).  The core
 * plugin uses the dynamic `state` field to determine whether an
 * achievement is secret or not, so in this edge‑case the secret flag
 * can be lost and the achievement’s real name will be drawn even
 * though the secret image is still used.
 *
 * This fix overrides the `isSecret` check so that in global mode
 * achievements whose raw visibility is “secret” are treated as secret
 * until they are unlocked.  It leaves the original behaviour
 * untouched in local mode and respects the unlocked state so that
 * completed achievements reveal their name as intended.
 *
 * Place this plugin beneath SMO_Achievements in the plugin list so
 * that its overrides take effect after the original methods have been
 * defined.
 *
 * @help
 * There are no plugin parameters.  Simply install the plugin below
 * SMO_Achievements and enable it.  It will automatically override the
 * secret check in global mode.
 * 
 */
(function() {
  'use strict';
  // Only apply the fix if the core plugin and its namespace exist
  if (!window.SMO || !SMO.AM || !SMO.AM.isGlobalMode) return;

  /**
   * Override of Achievement_Data.isSecret
   *
   * In the original plugin `isSecret` returns true only when the
   * dynamic state is -1.  However, when Global Mode is enabled and
   * fresh achievements are added after the global save was created,
   * their dynamic state will be zero (locked) even if their visibility
   * is defined as 'secret' in the database.  As a result the
   * achievements show their real name in the list while still using
   * the secret image.  This implementation retains the original logic
   * in local mode and adds a fallback for global mode: an achievement
   * is considered secret when its raw visibility is "secret" and it
   * has not been unlocked yet.
   *
   * @returns {Boolean} true if the achievement should be treated as
   *  secret in the menu.
   */
  const _SMO_AM_isSecret = Achievement_Data.prototype.isSecret;
  Achievement_Data.prototype.isSecret = function() {
    // If global mode is not active, keep the original behaviour
    if (!SMO.AM.isGlobalMode) {
      return _SMO_AM_isSecret.call(this);
    }
    // In global mode consider the raw visibility when not unlocked
    if (!this.isUnlocked() && String(this.visibility).toLowerCase() === 'secret') {
      return true;
    }
    // Otherwise defer to the dynamic state
    return _SMO_AM_isSecret.call(this);
  };

  /**
   * Override of Window_AchievInfo.getReqRewData
   *
   * The original implementation assumes that both `_requirementsList` and
   * `_rewardsList` always exist.  When rewards are disabled via the plugin
   * parameter (SMO.AM.useRewards === false), `_rewardsList` is never
   * created.  In that case selecting a secret achievement causes the
   * original code to attempt to set `_itemHeight` on an undefined
   * object.  This override simply adds existence checks around the
   * assignments when the selected achievement is secret.  All other
   * behaviour falls back to the original method.
   */
  if (typeof Window_AchievInfo !== 'undefined') {
    const _SMO_AM_getReqRewData = Window_AchievInfo.prototype.getReqRewData;
    Window_AchievInfo.prototype.getReqRewData = function(dataName) {
      // If there is selected data and it is secret, initialise
      // placeholder items only on existing lists to avoid errors.
      if (this._data && this._data.isSecret && this._data.isSecret()) {
        const secretItem = { name: SMO.AM.secretSign, align: 'center' };
        if (this._requirementsList) {
          this._requirementsList._itemHeight = 68;
          this._requirementsList._cols = 1;
          this._requirementsList.setItemList([secretItem]);
        }
        if (this._rewardsList) {
          this._rewardsList._itemHeight = 68;
          this._rewardsList._cols = 1;
          this._rewardsList.setItemList([secretItem]);
        }
        return;
      }
      // Otherwise defer to the original implementation
      return _SMO_AM_getReqRewData.call(this, dataName);
    };
  }
})();