import { BaseItemData } from './base-item.mjs'

export class SimpleItemData extends BaseItemData {
	
	//The simple item is going to be just a name image and description.
	//Features, talents, inventory, and other abilities are all simple items.
	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			...super.hasDetails(),
			type: new fields.StringField({
				required: true,
				initial: '',
				empty: false
				//Could add an options field, but dont really need to :D
			})
		};
	}
}
