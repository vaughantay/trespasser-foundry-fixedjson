import { CharacterBaseData } from './character-base.mjs'

export class MonsterData extends CharacterBaseData {
	static defineSchema() {

		const fields = foundry.data.fields;
		//For sake of enemies, i want to cut the attributes out
		//and make a parent class for base actors.
		return {
			//This does the characterBaseData
			...super.defineSchema(),

			initiative: new fields.NumberField({
				required: true,
				initial: 1,
				integer: true,
				min: 0
			}),

			accuracy: new fields.NumberField({
				required: true,
				initial: 1,
				integer: true,
				min: 0
			}),

			guard: new fields.NumberField({
				required: true,
				initial: 1,
				integer: true,
				min: 0
			}),

			resist: new fields.NumberField({
				required: true,
				initial: 1,
				integer: true,
				min: 0
			}),

			roll_bonus: new fields.NumberField({
				required: true,
				initial: 1,
				integer: true,
				min: 0
			})
		}
	}
}
