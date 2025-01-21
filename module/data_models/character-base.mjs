export class CharacterBaseData extends foundry.abstract.TypeDataModel {
	static defineSchema() {

		const fields = foundry.data.fields;
		return {
			attributes: new fields.SchemaField({
				might: new fields.NumberField({
					required: true,
					initial: 1,
					integer: true,
					min: 0,
					max: 10
				}),
				agility: new fields.NumberField({
					required: true,
					initial: 1,
					integer: true,
					min: 0,
					max: 10
				}),
				intellect: new fields.NumberField({
					required: true,
					initial: 1,
					integer: true,
					min: 0,
					max: 10
				}),
				spirit: new fields.NumberField({
					required: true,
					initial: 1,
					integer: true,
					min: 0,
					max: 10
				})
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
					initial: 5
				})
			})
		};
	}

}
