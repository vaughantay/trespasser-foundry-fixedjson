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
			width: 900,
			height: 700,
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

		//Actions are shared between monster and adventurer. So we will leave them out of the if statement.
		const actions = [];

		if(this.actor.type === 'adventurer') {
			//We will add to this based on which armor pieces are equipped.
			let calculatedAC = this.actor.system.base_armor_class;
			//Max HP is either 10, or your vigor score, whichever is higher
			let calculatedHP = this.actor.system.attributes.vig > 10 ? this.actor.system.attributes.vig : 10;
			const equippedArmor = {};
			const equippedWeapons = {};
			const inventory = [];
			const features = [];
			const otherAbilities = [];
			const talents = [];

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
					if (weapon.equipped_left) {
						equippedWeapons.left=item;
					} else if (weapon.equipped_right) {
						equippedWeapons.right = item;
					}
					else{
						inventory.push(item);
					}
				}

				if (item.type == 'feature') {
					features.push(item);
				}

				if (item.type == 'talent') {
					talents.push(item);
				}

				if (item.type == 'inventory_item') {
					inventory.push(item);
				}

				if (item.type == 'action') {
					actions.push(item);
				}

				if(item.type == 'spell') {
					spells.push(item);
				}
			});


			context.HP = calculatedHP;
			context.AC = calculatedAC;
			context.equippedWeapons = equippedWeapons;
			context.equippedArmor = equippedArmor;
			context.features = features;
			context.talents = talents;
			context.actions = actions;
			context.spells = spells;
			context.inventory = inventory;
		} else if (this.actor.type = 'monster') {
			
			let items = Object.values(Object.values(this.actor.items)[4]);
			const tags = [];

			items.forEach((item, i) => {
				if(item.type == 'monster-tag') {
					tags.push(item);
				}
			});
			context.tags = tags;
		}

		context.actions = actions;

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
      //const document =,
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

		html.on('click', '.armordie', (ev) => {

		});

		html.on('click', '.recollect', (ev) => {
			let items = Object.values(Object.values(this.actor.items)[4]);
			items.forEach((item, i) => {
				let armor = this.actor.items.get(item._id);
				if(armor.type == 'armor') {
					armor.update({ "system.die_used": false});
				}
			});
		});

		html.on('click', '.keyattribute', (ev) => {
			console.log(this.actor.system.keyattribute);
		});

		html.on('click', '.longrest', (ev) => {
			let d = new Dialog({
 			title: "Long Rest",
 			content: "<p>Take a long rest?</p>",
 			buttons: {
  		one: {
   		icon: '<i class="fas fa-check"></i>',
   		label: "Rest",
   callback: () =>
		{
			let items = Object.values(Object.values(this.actor.items)[4]);
			let effort = this.actor.system.base_effort;
			let recovery = this.actor.system.recovery.max;
			let current = this.actor.system.recovery.current;
			let hp = this.actor.system.combat.hit_points.max;
			this.actor.update({"system.combat.hit_points.value": hp});
			this.actor.update({"system.recovery.current": recovery});
			this.actor.update({"system.effort": effort});
			items.forEach((item, i) => {
			let action = this.actor.items.get(item._id);
			 if(action.type == 'action') {
				 if (action.system.tier === 'basic') {
					 action.update({"system.currentEffortCost": 0});
				 }
				 else if (action.system.tier === 'special') {
					 action.update({"system.currentEffortCost": 1});
				 } else if (action.system.tier === 'mighty') {
					 action.update({"system.currentEffortCost": 2});
				 }
				 action.update({"system.increaseCount": 0});
			 }
			});
		}
  },
  	two: {
   icon: '<i class="fas fa-times"></i>',
   label: "No",
		  }
		 },
		 default: "two",
		});
		d.render(true);

		});

		html.on('click', '.recover', (ev) => {
			let recovery = this.actor.system.recovery.current;
			let potency_dice = this.actor.system.potency_dice;
			let health = this.actor.system.combat.hit_points.current;
			let maxhp = this.actor.system.combat.hit_points.max;
			if (recovery > 0) {
				const roll = new Roll(
					"d@potency",
					{
						potency:potency_dice
					});
				roll.toMessage({
					flavor:'Recovery',
					speaker: ChatMessage.getSpeaker({ actor: this.actor }),
					rollMode: game.settings.get('core', 'rollMode'),
				});
				recovery = recovery -1;
				this.actor.update({"system.recovery.current": recovery});
				console.log(roll.result);
			}
		});
  }
	//Not working yet
	async _onItemCreate(event) {
		event.preventDefault();

		const header = event.currentTarget;

		const type = header.dataset.type;

		const data = {...header.dataset};

		let name = `New ${type.capitalize()}`;

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
		console.log(action.system.currentEffortCost);

		//This is where we can increase the roll information too.
		//this is just disgusting, ew
		if(action.system.tier != 'basic') {
			const increase = action.system.tier === 'special' ? 1 : 2;
			if(action.currentEffortCost == 0) {
				action.update({"system.currentEffortCost": increase});
				increase += increase;
			}
			if((this.actor.system.effort - action.system.currentEffortCost) >= 0) {
				this.actor.update({"system.effort": this.actor.system.effort - action.system.currentEffortCost});
				if(action.system.increaseCount != 3) {
					action.update({"system.currentEffortCost": action.system.currentEffortCost + increase});
					action.update({"system.increaseCount": action.system.increaseCount + 1});
				}
			} else {
				return ui.notifications.warn("You do not have enough effort.");
			}
		}


		let sFlavor = action.name;
		const roll = new Roll(
			"d20 + @abilityBonus + @skilledBonus",
			{
				abilityBonus: ability_bonus,
				skilledBonus: this.actor.system.skill_bonus
			});
		//If we are going with support. We just have DC 10.

		let hasDC = false;
		let succeedDC = false;
		// if(action.system.is_support) {
		// 	hasDC = true;
		// 	if (result > 10) {
		// 		succeedDC = true;
		// 	}
		// }// else {
		// 	//DC is going to be the opponent's AC.
		// 	let targets = game.user.targets;
		// 	if(targets.values().next().value?.actor) {
		// 		console.log(targets.values().next().value?.actor._source.system.base_armor_class);
		// 		hasDC = true;
		// 		if(result > targets.values().next().value?.actor._source.system.base_armor_class()){
		// 			succeedDC = true;
		// 		}
		// 	} else {
		// 		hasDC = false;
		// 	}
		// }


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
		if (action.system.hit_weapon || action.system.hit_potency  || action.system.uses_bonus) {
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
			let bonus = 0;
			if (action.system.uses_bonus) {
				bonus = this.actor.system.ability_mods[action.system.skill];
			}
			const rollEval = `${action.system.hit_weapon}d${weapon_dice} + ${action.system.hit_potency}d${this.actor.system.potency_dice} + ${bonus}`;



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

	async _createActionSolid(event) {
		const li = $(event.currentTarget).parents('.,action');
		const action = this.actor.items.get(li.data('itemId'));
		if (action.system.solid_hit_weapon || action.system.solid_hit_potency || action.system.hit_weapon || action.system.hit_potency || action.system.uses_bonus) {
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
			let bonus = 0;
			if (action.system.uses_bonus) {
				bonus = this.actor.system.ability_mods[action.system.skill];
			}
			const chat = action.system.hit + "<br>" + action.system.solid_hit;

			const rollEval = `${weaponAmount}d${weapon_dice} + ${potencyAmount}d${this.actor.system.potency_dice} + ${bonus}`
			const roll = new Roll(
				rollEval,
				{
					weapon_amount: action.hit_weapon,
					weapon_dice: weapon_dice,
					potency_amount: action.hit_potency,
					potency_dice: this.actor.system.potency_dice,
				});
				let sFlavor = `${action.name} | Solid Hit`
				roll.toMessage({
					flavor:sFlavor,
					speaker: ChatMessage.getSpeaker({ actor: this.actor }),
					rollMode: game.settings.get('core', 'rollMode')
				});
		}
  }
}
