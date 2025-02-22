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
					max: 5
				}),
				agility: new fields.NumberField({
					required: true,
					initial: 1,
					integer: true,
					min: 0,
					max: 5
				}),
				intellect: new fields.NumberField({
					required: true,
					initial: 1,
					integer: true,
					min: 0,
					max: 5
				}),
				spirit: new fields.NumberField({
					required: true,
					initial: 1,
					integer: true,
					min: 0,
					max: 5
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
				words: new fields.StringField({
					required: true,
					initial: '',
					blank: true
				}),
			}),
			skills: new fields.SchemaField({
				acrobatics: new fields.BooleanField({
					required: true,
					initial: false
				}),
				alchemy: new fields.BooleanField({
					required: true,
					initial: false
				}),
				athletics: new fields.BooleanField({
					required: true,
					initial: false
				}),
				crafting: new fields.BooleanField({
					required: true,
					initial: false
				}),
				folklore: new fields.BooleanField({
					required: true,
					initial: false
				}),
				letters: new fields.BooleanField({
					required: true,
					initial: false
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
				})
			}),
			effort: new fields.NumberField({
				required: true,
				initial: 0,
				min: 0,
				max: 1000
			}),
			recovery: new fields.SchemaField({
				current: new fields.NumberField({
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
				})
			}),
			xp: new fields.NumberField({
				required: true,
				initial: 0,
				min: 0
			}),
			alignment: new fields.SchemaField({
				a: new fields.SchemaField({
					name: new fields.StringField({
						required: true,
						initial: '',
						blank: true
					}),
					affirm: new fields.NumberField({
						required: true,
						initial: 0,
						min: 0,
						max: 3
					}),
					deny: new fields.NumberField({
						required: true,
						initial: 0,
						min: 0,
						max:3
					})
				}),
				b: new fields.SchemaField({
					name: new fields.StringField({
						required: true,
						initial: '',
						blank: true
					}),
					affirm: new fields.NumberField({
						required: true,
						initial: 0,
						min: 0,
						max: 3
					}),
					deny: new fields.NumberField({
						required: true,
						initial: 0,
						min: 0,
						max: 3
					})
				})
			}),
			weapons: new fields.SchemaField({
				weaponL: new fields.StringField({
					required: true,
					initial: '',
					blank: true
				}),
				weaponR: new fields.StringField({
					required: true,
					initial: '',
					blank: true
				})
			}),
			options: new fields.SchemaField({
				useLineage: new fields.BooleanField({
					required: true,
					initial: false
				}),
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
			}),
			level: new fields.NumberField({
				required: true,
				initial: 1,
				min: 0
			})
		}
	}

	get skill_bonus() {
		const level = this.level;

		if (level <= 2) {
			return 1;
		} else if (level <= 4) {
			return 2;
		} else if (level <= 6) {
			return 3;
		} else if (level <= 8) {
			return 4;
		} else {
			return 5;
		}
	}

	get is_peasant() {
		return (level == 1) ? true : false;
	}

	get initiative() {
		return this.attributes.agility + this.skill_bonus;
	}
	get accuracy() {
		let keyval = 0;
		if (this.keyattribute.might) {
			keyval = this.attributes.might;
		}
		else if (this.keyattribute.agility) {
			keyval = this.attributes.agility;
		}
		else if (this.keyattribute.intellect) {
			keyval = this.attributes.intellect;
		}
		else if (this.keyattribute.spirit) {
			keyval = this.attributes.spirit;
		}
		return keyval + this.skill_bonus;
	}
	get keyattr(){
			let keystring = 'None';
			if (this.keyattribute.might) {
				keystring='Might';
			}
			else if (this.keyattribute.agility) {
				keystring='Agility';
			}
			else if (this.keyattribute.intellect) {
				keystring='Intellect';
			}
			else if (this.keyattribute.spirit) {
				keystring='Spirit';
			}
			return keystring;
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

	//set to this on haven rest
	get max_endurance(){
		return this.attributes.spirit + 10;
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

	get totalspeed(){
		return 5 + this.attributes.agility + this.combat.speed;
	}

	get base_effort() {
		return this.attributes.intellect;
	}

	get inventory_max() {
		return (this.attributes.might * 2);
	}

}
