import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from '../helpers/effects.mjs'
import { renderDialog } from '../helpers/dialog.mjs';
import { TrespasserRoll } from '../roll/trespasser-roll.mjs';

export class TrespasserActorSheet extends ActorSheet {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ['trespasser', 'sheet', 'actor'],
			width: 850,
			height: 550,
			tabs: [
				{
					navSelector: '.sheet-tabs',
					contentSelector: '.sheet-body',
					initial: 'main',
				},
			],
		});
	}

  get template() {
    return `systems/trespasser/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  getData() {

		const context = {};

		//We will add to this based on which armor pieces are equipped.
		let calculatedAC = this.actor.system.base_armor_class;
		const equippedArmor = {};
		const equippedWeapons = {};
		const inventory = [];
		const features = [];
		const otherAbilities = [];
		const talents = [];
		const actions = [];
		const spells = [];

		let items = Object.values(Object.values(this.actor.items)[4]);
		items.forEach((item, i) => {
			if (item.type == 'armor') {
				const armor = item.system;
				//If equipped, add the ac to the calculated AC
				calculatedAC = armor.equipped ? armor.ac : 0;

				//Now we get the equipped armor.
				if (armor.equipped) {
					//This will look like head: {ac, location, etc.}
					//If there is nothing equipped in a slot, the data will not populate, may need to change this.
					equippedArmor[armor.loc] = item;
				}
				else{
					inventory.push(item);
				}
			}

			//Return the weapons in either hand.
			if (item.type == 'weapon') {
				const weapon = item.system;
				console.log(weapon.two_handed);
			/*	if (weapon.twohanded) {
					if (weapon.equipped_left || weapon.equipped_right){
						equippedWeapons.right = item;
						equippedWeapons.left = equippedWeapons.right;
					} else inventory.push(item);
				}
				else
				This doesn't work yet dw about it */
				if (weapon.equipped_left) {
					equippedWeapons.left=item;
				} else if (weapon.equipped_right) {
					equippedWeapons.right = item;
				}
				else{
					inventory.push(item);
				}
			}

			if (item.type == 'simple_item') {
				const simpleItem = item.system;
				if (simpleItem.type == 'feature') {
					features.push(item);
				}

				if (simpleItem.type == 'other-ability') {
					otherAbilities.push(item);
				}

				if (simpleItem.type == 'talent') {
					talents.push(item);
				}
				else{
					inventory.push(item);
				}
			}

			if (item.type == 'action') {
				actions.push(item);
			}

			if(item.type == 'spell') {
				spells.push(item);
			}
		});


		context.AC = calculatedAC;
		context.equippedWeapons = equippedWeapons;
		context.equippedArmor = equippedArmor;
		context.features = features;
		context.otherAbilities = otherAbilities;
		context.talents = talents;
		context.actions = actions;
		context.spells = spells;
		context.inventory = inventory;

		console.log(context);
		return {
			'context': context,
			actor: this.actor,
			system: this.actor.system,
			flags: this.actor.flags
		};

  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    if (!this.isEditable) return;

		html.on('click', '.weapon-equip-L', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
			const weaponL = $(".weaponL");
			const current = this.actor.items.get(weaponL.data('itemId'));
      const weap = this.actor.items.get(li.data('itemId'));
			if (current) current.update({ 'system.equipped_left' :  false });
			weap.update({ 'system.equipped_left' :  true });
    });
		html.on('click', '.weapon-equip-R', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
			const weaponL = $(".weaponR");
			const current = this.actor.items.get(weaponL.data('itemId'));
      const weap = this.actor.items.get(li.data('itemId'));
			if (current) current.update({ 'system.equipped_right' :  false });
			weap.update({ 'system.equipped_right' :  true });
    });

		html.on('click', '.weapon-unequip', (ev) =>{
			const item = this.actor.items.get($(ev.currentTarget).data('itemId'));
			if (item) {
				item.update({ 'system.equipped_right' :  false });
				item.update({ 'system.equipped_left' :  false });
			}
		});

    html.on('click', '.item-create', this._onItemCreate.bind(this));

    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      //const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

		html.on('click', '.roll', this._createRoll.bind(this));

    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }
	//Not working yet
	_onItemCreate(html) {
		return;
	}

	async _createRoll(event) {

		const data = await renderDialog(
			game.i18n.localize('TRESPASSER.Dialogs.roll'),
			this._processRollDialog,
			{
				abilities: {...CONFIG.TRESPASSER.AbilitiesLong},
				skills: {...CONFIG.TRESPASSER.PlayerSkills},
				selectedAbility: "agi",
				selectedSkill: "acrobatics"
			},
			'systems/trespasser/templates/dialogs/roll.hbs',
		);

		//If we override the skilled trait, we can just choose true, otherwise get the skill status of the skill selected.
		const skilled = data.skilledOverride ? true : this.actor.system.skills[data.skill];

		const skilled_bonus = skilled ? this.actor.system.skill_bonus : 0;
		const ability_bonus = this.actor.system.ability_mods[data.ability];
		
		let roll = new Roll(
			"d20 + @abilityBonus + @skilledBonus", 
			{
				abilityBonus: ability_bonus,
				skilledBonus: skilled_bonus 
			});

		//Now we can create an updated roll chat card, and plug the data in here.
		//Make that the content of the actual thing.

		roll.toMessage({
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			rollMode: game.settings.get('core', 'rollMode'),
		});
	}

	_processRollDialog(html) {
		const form = html[0].querySelector('form');

		return {
			ability: form.ability.value,
			skill: form.skill.value,
			skilledOverride: form.skilled_override.checked
		};
	}
}
