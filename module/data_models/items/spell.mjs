import { BaseItemData } from './base-item.mjs'

export class SpellData extends BaseItemData {
	
	//This is a place to define templates, I'll make a few inherited methods which act as templates.

	static defineSchema() {

		const fields = foundry.data.fields;
		return {
			...super.hasDetails,
			//There is a cumulative penalty to casting the more you cast something per day.
			//Tracked per spell.
			casting_penalty: new fields.NumberField({
				required: true,
				initial: 0,
				min: 0
			}),
		};
	}
}
