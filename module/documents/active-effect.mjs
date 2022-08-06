/**
 * Disable active effects
 */
export default class ActiveEffect5e extends ActiveEffect {
  constructor (data, context) {
    data.disabled = true;
    data.transfer = false;
    super(data, context);
  }
}
