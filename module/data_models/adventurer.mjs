import { CharacterBaseData } from './character-base.mjs'

export class AdventurerData extends CharacterBaseData {
	static defineSchema() {

		const fields = foundry.data.fields;
		//For sake of enemies, i want to cut the attributes out
		//and make a parent class for base actors.
		return {
			//This does the characterBaseData
			...super.defineSchema(),

			//Attributes will be a schema with numbers inside.
			//Buncha text fields.
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
				alignment: new fields.StringField({
					required: true,
					initial: '',
					blank: true
				}),
			}),
			xp: new fields.NumberField({
				initial: 0,
				min: 0,
				max: 40000
			}),
			//Skills are yes or no.
			skills: new fields.SchemaField({
				acrobatics: new fields.BooleanField({
					required: true,
					initial: false
				}),
				athletics: new fields.BooleanField({
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
				mystery: new fields.BooleanField({
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
			}),
			//Dont have a better place for this unfortunately.
			effort: new fields.NumberField({
				required: true,
				initial: 4,
				min: 0,
				max: 8
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

	//Skilled modifier is just the regular mod plus the skill bonus based on level.
	get skilled_mods() {
		const mods = {...this.ability_mods};
		const skillBonus = this.skill_bonus;

		return {
			str: mods.str + skillBonus,
			agi: mods.agi + skillBonus,
			vig: mods.vig + skillBonus,
			knw: mods.knw + skillBonus,
			cng: mods.cng + skillBonus,
			res: mods.res + skillBonus
		};
	}

	get is_peasant() {
		return (level == 0) ? true : false;
	}

	get initiative() {
		return this.skilled_mods.cng;
	}

	//Base because this gets modified by armor, which will be items.
	//Should be able to handle it in a sheet no problem.
	get base_armor_class() {
		return 10 + this.ability_mods.agi;
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
		return this.attributes.str;
	}
}
