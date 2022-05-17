import Actor5e from "../entity.js";


export default class Vehicle5e extends Actor5e {
  /** @override */
  prepareBaseData() {
    const actorData = this.data;
    const data = actorData.data;

    // Proficiency
    data.attributes.prof = 0;
  }
}
