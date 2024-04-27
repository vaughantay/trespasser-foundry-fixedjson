class AdventurerData extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			//Attributes will be a schema with numbers inside.
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
			})
		}
	}
}
