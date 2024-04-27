export class CharacterBaseData extends foundry.abstract.TypeDataModel {
	static defineSchema() {

		const fields = foundry.data.fields;
		return {
			attributes: new fields.SchemaField({
				str: new fields.NumberField({
					required: true,
					initial: 10,
					integer: true,
					min: 3,
					max: 18
				}),
				agi: new fields.NumberField({
					required: true,
					initial: 10,
					integer: true,
					min: 3,
					max: 18
				}),
				vig: new fields.NumberField({
					required: true,
					initial: 10,
					integer: true,
					min: 3,
					max: 18
				}),
				knw: new fields.NumberField({
					required: true,
					initial: 10,
					integer: true,
					min: 3,
					max: 18
				}),
				cng: new fields.NumberField({
					required: true,
					initial: 10,
					integer: true,
					min: 3,
					max: 18
				}),
				res: new fields.NumberField({
					required: true,
					initial: 10,
					integer: true,
					min: 3,
					max: 18
				}),
			}),
			combat: new fields.SchemaField({
				hit_points: new fields.SchemaField({
					//Pending question on how to make the max of this equal to max. May need to handle in change listener, which is fine.
					value: new fields.NumberField({
						required: true,
						initial: 10
					}),
					max: new fields.NumberField({
						required: true,
						initial: 10
					})
				}),
				speed: new fields.NumberField({
					required: true,
					initial: 10
				})
			})
		};
	}

	// Does the math for getting the ability modifiers.
	get ability_mods() {
		return {
			str: Math.floor((this.attributes.str - 10) / 2),
			agi: Math.floor((this.attributes.agi - 10) / 2),
			vig: Math.floor((this.attributes.vig - 10) / 2),
			knw: Math.floor((this.attributes.knw - 10) / 2),
			cng: Math.floor((this.attributes.cng - 10) / 2),
			res: Math.floor((this.attributes.res - 10) / 2)
		};
	}

	//1 reaction for every 5 points of agility
	get reactions() {
		return Math.floor(this.attributes.agi / 5)
	}
}
