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
				calculatedAC += armor.equipped ? armor.armor_class : 0;
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
				} else if (simpleItem.type == 'other-ability') {
					otherAbilities.push(item);
				} else if (simpleItem.type == 'talent') {
					talents.push(item);
				} else {
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

		html.on('click', '.armor-equip', (ev) =>{
			const item = this.actor.items.get($(ev.currentTarget).parents('.item').data('itemId'));
			if (item) {
				item.update({ 'system.equipped' :  true });
			}
		});

		html.on('click', '.armor-unequip', (ev) =>{
			const item = this.actor.items.get($(ev.currentTarget).data('itemId'));
			if (item) {
				item.update({ 'system.equipped' :  false });
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

		html.on('click', '.action-roll', this._createActionRoll.bind(this));
		html.on('click', '.action-hit', this._createActionHit.bind(this));
		html.on('click', '.action-solid', this._createActionSolid.bind(this));
		html.on('click', '.expand-header', (ev) => {
			let li = $(ev.currentTarget.parentNode).find('.expand');
			if (li.is(':hidden')) {
				li.slideDown();
			} else {	
				li.slideUp();
			}
		});

  }
	//Not working yet
	async _onItemCreate(event) {
		event.preventDefault();

		const header = event.currentTarget;

		const type = header.dataset.type;

		const data = {...header.dataset};

		if (type == 'simple_item') {
			data['type'] = `${header.dataset.itemType}`;
		}

		let name = `New ${type.capitalize()}`;

		if (type == 'simple_item') {
			name = `New ${game.i18n.localize(CONFIG.TRESPASSER.SimpleItemTypes[data.type])}`;
		}

		const itemData = {
			name: name,
			type: type,
			system: data,
		};


		return await Item.create(itemData, { parent: this.actor });
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

		//If cancelled button is clicked, just dont make a roll.
		if(data.cancelled == true) {
			return;
		}

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

	async _createActionRoll(event) {
		const li = $(event.currentTarget).parents('.action');
		const action = this.actor.items.get(li.data('itemId'));
		const ability_bonus = this.actor.system.ability_mods[action.system.skill];
		const penalty = 0;
		let sFlavor = action.name;
		const roll = new Roll(
			"d20 + @abilityBonus + @skilledBonus",
			{
				abilityBonus: ability_bonus,
				skilledBonus: this.actor.system.skill_bonus
			});
			console.log(action.system.tier);
		if (action.system.tier == "special") {
			penalty = 1;
		}
		else if (action.system.tier == "mighty") {
			penalty = 2;
		}

		if (this.actor.system.effort>=penalty) {

		} else return;
		//If we are going with support. We just have DC 10.
		let hasDC = false;
		let succeedDC = false;
		if(action.system.is_support) {
			hasDC = true;
			if (result > 10) {
				succeedDC = true;
			}
		} else {
			//DC is going to be the opponent's AC.
			let targets = game.user.targets;
			if(targets.values().next().value?.actor) {
				hasDC = true;
				if(result > targets.values().next().value?.actor._source.system.base_armor_class()){
					succeedDC = true;
				}
			} else {
				hasDC = false;
			}
		}


		if (hasDC) {
			if (succeedDC) {
				sFlavor = sFlavor.concat(" : ", "Success");
			}
			else {
				sFlavor = sFlavor.concat(" : ", "Failure");
			}
		}
		roll.toMessage({
			flavor:sFlavor,
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			rollMode: game.settings.get('core', 'rollMode'),
		});
	}

	async _createActionHit(event) {
		const li = $(event.currentTarget).parents('.action');
		const action = this.actor.items.get(li.data('itemId'));
		const items = this.actor.items;
		let weapon_dice = 4;
		let weapon_effect = "";
		items.forEach((item, i) => {
				if (item.type == 'weapon') {
					const weapon = item.system;
					if (weapon.equipped_left || weapon.equipped_right) {
						if (weapon.damage > weapon_dice) {weapon_dice = weapon.damage;}
							weapon_effect = `${weapon_effect} | ${weapon.details}`;
					}
			}
		});
		const rollEval = `${action.system.hit_weapon}d${weapon_dice} + ${action.system.hit_potency}d${this.actor.system.potency_dice}`
		const roll = new Roll(
			rollEval,
			{
				weapon_amount: action.hit_weapon,
				weapon_dice: weapon_dice,
				potency_amount: action.hit_potency,
				potency_dice: this.actor.system.potency_dice,
			});
			let sFlavor = `${action.name} | Hit`
			roll.toMessage({
				flavor:sFlavor,
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				rollMode: game.settings.get('core', 'rollMode'),
			});
	}

	async _createActionSolid(event) {
		const li = $(event.currentTarget).parents('.action');
		const action = this.actor.items.get(li.data('itemId'));
		const items = this.actor.items;
		let weapon_dice = 4;
		let weapon_effect = "";
		items.forEach((item, i) => {
				if (item.type == 'weapon') {
					const weapon = item.system;
					if (weapon.equipped_left || weapon.equipped_right) {
						if (weapon.damage > weapon_dice) {weapon_dice = weapon.damage;}
							weapon_effect = `${weapon_effect} | ${weapon.details}`;
					}
			}
		});
		const weaponAmount = action.system.hit_weapon + action.system.solid_hit_weapon;
		const potencyAmount = action.system.hit_potency + action.system.solid_hit_potency;
		const rollEval = `${weaponAmount}d${weapon_dice} + ${potencyAmount}d${this.actor.system.potency_dice}`
		const roll = new Roll(
			rollEval,
			{
				weapon_amount: action.hit_weapon,
				weapon_dice: weapon_dice,
				potency_amount: action.hit_potency,
				potency_dice: this.actor.system.potency_dice,
			});
			let sFlavor = `${action.name} | Hit`
			roll.toMessage({
				flavor:sFlavor,
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				rollMode: game.settings.get('core', 'rollMode'),
			});
  }
}
