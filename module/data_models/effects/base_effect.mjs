export class BaseAEModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      level:new fields.NumberField({
				require: true,
				initial: 1,
				min: 0
			})
    }
  }
}
