import { BaseItemData } from './base-item.mjs'

export class ActionData extends BaseItemData {

	//This is a place to define templates, I'll make a few inherited methods which act as templates.
	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			...super.hasDetails(),
			//The skill that's rolled on.
			skill: new fields.StringField({
				required: true,
				initial: 'agi',
				options: ['agi', 'str', 'vig', 'knw', 'cng', 'res'],
				empty: false
			}),
			//Actions can be either basic, special, or mighty.
			tier: new fields.StringField({
				required: true,
				initial:'basic',
				option: ['basic', 'special', 'mighty'],
				empty: false
			}),
			currentEffortCost: new fields.NumberField({
				require: true,
				initial: 0,
				min: 0
			}),
			increaseCount: new fields.NumberField({
				require: true,
				initial: 0,
				min: 0,
				max: 3 
			}),
			//All actions must have a skill and whether its attack or support.
			//I just want to have a button to confirm whether its support, if false, its an attack
			is_support: new fields.BooleanField({
				required: true,
				initial: false
			}),
			uses_bonus: new fields.BooleanField({
				required: true,
				initial: false
			}),
			//A case could be made for more robust keywords, like with an array or something.
			//But i think thats too much work. Having a simple system where folks can type what they want makes more sense here.
			keywords: new fields.StringField({
				required: false,
				initial: '',
				empty: true
			}),
			target: new fields.StringField({
				required: false,
				initial: '',
				empty: true
			}),
			hit: new fields.HTMLField({
				required: true,
				initial: '',
				empty: true
			}),
			hit_weapon: new fields.NumberField({
				required: false,
				initial: 0,
				min: 0
			}),
			hit_potency: new fields.NumberField({
				required: false,
				initial: 0,
				min: 0
			}),
			solid_hit: new fields.HTMLField({
				required: false,
				initial: '',
				empty: true
			}),
			solid_hit_weapon: new fields.NumberField({
				required: false,
				initial: 0,
				min: 0
			}),
			solid_hit_potency: new fields.NumberField({
				required: false,
				initial: 0,
				min: 0
			})
		};
	}
}
