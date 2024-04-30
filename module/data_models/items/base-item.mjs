export class BaseItemData extends foundry.abstract.TypeDataModel {
	
	//This is a place to define templates, I'll make a few inherited methods which act as templates.

	static defineSchema() {

		const fields = foundry.data.fields;
		return {
			
		};
	}

	//If an object is going to have details, ill just have something for that.
	static hasDetails() {
		const fields = foundry.data.fields;
		return {
			details: new fields.HTMLField({
					required: true,
					initial: '',
					blank: true
			}),
		}
	}

	static hasWeight() {
		const fields = foundry.data.fields;
		return {
			weight: new fields.StringField({
				required: true,
				initial: 'L',
				blank: false,
				choices: ['L','M','H']
			}),
		}
	}
}
