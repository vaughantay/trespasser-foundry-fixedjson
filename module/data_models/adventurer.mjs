import { CharacterBaseData } from './character-base.mjs'

export class AdventurerData extends CharacterBaseData {
	static defineSchema() {

		const fields = foundry.data.fields;
		//For sake of enemies, i want to cut the attributes out
		//and make a parent class for base actors.
		return {
			//This does the characterBaseData
			...super.defineSchema(),

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
			text_details: new fields.SchemaField({
				lineage: new fields.StringField({
					required: true,
					initial: '',
					blank: true
				}),
				class_name: new fields.StringField({
					required: true,
					initial: '',
					blank: true
				}),
				//Themes is a list, but we jsut want to separate by comma.
				themes: new fields.StringField({
					required: true,
					initial: '',
					blank: true
				}),
				profession: new fields.StringField({
					required: true,
					initial: '',
					blank: true
				}),
				strengths: new fields.StringField({
					required: true,
					initial: '',
					blank: true
				}),
				flaws: new fields.StringField({
					required: true,
					initial: '',
					blank: true
				}),
				words: new fields.StringField({
					required: true,
					initial: '',
					blank: true
				}),
			}),
			magic: new fields.BooleanField({
				required: true,
				initial: false
			}),
			nature: new fields.BooleanField({
				required: true,
				initial: false
			}),
			perception: new fields.BooleanField({
				required: true,
				initial: false
			}),
			speech: new fields.BooleanField({
				required: true,
				initial: false
			}),
			stealth: new fields.BooleanField({
				required: true,
				initial: false
			}),
			tinkering: new fields.BooleanField({
				required: true,
				initial: false
			}),
			//Dont have a better place for this unfortunately.
			effort: new fields.NumberField({
				required: true,
				initial: 4,
				min: 0,
				max: 8
			}),
			recovery: new fields.SchemaField({
				current: new fields.NumberField({
					required: true,
					initial: 0,
					min: 0
				}),
				max: new fields.NumberField({
					required: true,
					initial: 0,
					min: 0
				})
			}),
			endurance: new fields.SchemaField({
				current: new fields.NumberField({
					required: true,
					initial: 0,
					min: 0
				}),
				max: new fields.NumberField({
					required: true,
					initial: 0,
					min: 0
				})
			}),
			keyattribute: new fields.SchemaField({
				might: new fields.BooleanField({
					required: true,
					initial: false
				}),
				agility: new fields.BooleanField({
					required: true,
					initial: false
				}),
				intellect: new fields.BooleanField({
					required: true,
					initial: false
				}),
				spirit: new fields.BooleanField({
					required: true,
					initial: false
				}),
				value: new fields.NumberField({
					required: true,
					initial: 0,
					min: 0
				}),
				label: new fields.StringField({
					required: true,
					initial: 'might',
					blank: true
				})
			}),
			range: new fields.SchemaField({
				melee: new fields.NumberField({
					required: true,
					initial: 0,
					min: 0
				}),
				missile: new fields.NumberField({
					required: true,
					initial: 0,
					min: 0
				}),
				spell: new fields.NumberField({
					required: true,
					initial: 0,
					min: 0
				})
			}),
			injury: new fields.HTMLField({
					required: true,
					initial: '',
					blank: true
			}),
			resolve: new fields.NumberField({
				required: true,
				initial: 0,
				min: 0
			})
		}
	}
	//Returns level based on xp
	get level() {
		let level = 0;

		if (this.xp >= 30000) {
			level = 9;
		} else if (this.xp >= 24000) {
			level = 8;
		} else if (this.xp >= 18000) {
			level = 7;
		} else if (this.xp >= 14000) {
			level = 6;
		} else if (this.xp >= 10000) {
			level = 5;
		} else if (this.xp >= 7000) {
			level = 4;
		} else if (this.xp >= 4000) {
			level = 3;
		} else if (this.xp >= 2000) {
			level = 2;
		} else if (this.xp >= 100) {
			level = 1;
		}

		return level;
	}

	get skill_bonus() {
		const level = this.level;

		if (level <= 3) {
			return 2;
		} else if (level <= 6) {
			return 3;
		} else {
			return 4;
		}
	}

	get is_peasant() {
		return (level == 0) ? true : false;
	}

	get initiative() {
		return this.attributes.agility + this.skill_bonus;
	}
	get accuracy() {
		let keyval = 0;
		if (this.keyattribute.might) {
			this.keyattribute.label='Might';
			keyval = this.attributes.might;
		}
		else if (this.keyattribute.agility) {
			this.keyattribute.label='Agility';
			keyval = this.attributes.agility;
		}
		else if (this.keyattribute.intellect) {
			this.keyattribute.label='Intellect';
			keyval = this.attributes.intellect;
		}
		else if (this.keyattribute.spirit) {
			this.keyattribute.label='Spirit';
			keyval = this.attributes.spirit;
		}
		return keyval + this.skill_bonus;
	}
	get resist() {
		return this.attributes.spirit + this.skill_bonus;
	}
	get prevail() {
		return this.attributes.intellect + this.skill_bonus;
	}
	get tenacity(){
		return this.attributes.might + this.attributes.spirit;
	}

	//Base because this gets modified by armor, which will be items.
	//Should be able to handle it in a sheet no problem.
	get base_armor_class() {
		return this.attributes.agility;
	}

	get potency_dice() {
		let potency = 12;

		if (this.level >= 6) {
			potency = 10;
		} else if (this.level >= 3) {
			potency = 8;
		} else{
			potency = 6	;
		}
		return potency;
	}

	//4 + level / 2. It seems to round down, can work with this for now.
	//Effort changes all combat, so we have a field for current effort. Base effort is just a display field basically
	get base_effort() {
		return 4 + Math.floor(this.level / 2);
	}
	get inventory_max() {
		return this.attributes.might;
	}
}
