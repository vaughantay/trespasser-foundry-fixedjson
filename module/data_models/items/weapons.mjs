import { BaseItemData } from './base-item.mjs'

export class ArmorData extends BaseItemData {
	
	//This is a place to define templates, I'll make a few inherited methods which act as templates.
	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			...super.hasDetails(),
			...super.hasWeight(),
			armor_class: new fields.NumberField({
				required: true,
				initial: 0,
				min: -10
			}),
			dice: new fields.StringField({
				required: true,
				initial: 'd6',
				choices: ['d6', 'd8', 'd10']
			}),
			equipped: new fields.BooleanField({
				required: true,
				initial: false
			}),
			loc: new fields.StringField({
				required: true,
				initial: 'head',
				empty: false,
				options: ['head', 'body', 'arms', 'legs', 'outer', 'shield']
			})
		};
	}
}
