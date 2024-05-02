import { BaseItemData } from './base-item.mjs'

export class WeaponData extends BaseItemData {
	
	//This is a place to define templates, I'll make a few inherited methods which act as templates.
	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			//Use details for weapon effect, its easy.
			...super.hasDetails(),
			...super.hasWeight(),
			equipped_left: new fields.BooleanField({
				required: true,
				initial: false
			}),
			equipped_right: new fields.BooleanField({
				required: true,
				initial: false
			}),
			damage: new fields.StringField({
				required: false,
				initial: 'd4',
				options: ['d4', 'd6', 'd8', 'd10'],
				blank: true
			}),
			keywords: new fields.StringField({
				required: false,
				initial: '',
				blank: true
			})
		};
	}
}
