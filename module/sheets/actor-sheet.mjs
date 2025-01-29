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

		//deeds and features are shared between monster and adventurer. So we will leave them out of the if statement.

		const features = [];

		if(this.actor.type === 'adventurer') {
			//We will add to this based on which armor pieces are equipped.
			let calculatedAC = this.actor.system.base_armor_class;
			//Max HP is either 10, or your vigor score, whichever is higher
			let calculatedHP = this.actor.system.attributes.vig > 10 ? this.actor.system.attributes.vig : 10;
			const equippedArmor = {};
			const equippedWeapons = {};
			const inventory = [];
			const otherAbilities = [];
			const talents = [];
			const spells = [];
			const lightdeeds = [];
			const heavydeeds = [];
			const mightydeeds = [];
			const specialdeeds = [];
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
				else if (item.type == 'weapon') {
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

				else if (item.type == 'feature') {
					features.push(item);
				}

				else if (item.type == 'talent') {
					talents.push(item);
				}

				else if (item.type == 'object') {
					inventory.push(item);
				}

				else if (item.type == 'deed') {
					const tier = item.system.tier;
					if (tier == 'light') {
						lightdeeds.push(item);
					}else if (tier == 'heavy') {
						heavydeeds.push(item);
					}else if (tier == 'mighty') {
						mightydeeds.push(item);
					}else {
						specialdeeds.push(item);
					}

				}

				else if(item.type == 'spell') {
					spells.push(item);
				}
			});


			context.HP = calculatedHP;
			context.AC = calculatedAC;
			context.equippedWeapons = equippedWeapons;
			context.equippedArmor = equippedArmor;
			context.lightdeeds = lightdeeds;
			context.heavydeeds = heavydeeds;
			context.mightydeeds = mightydeeds;
			context.specialdeeds = specialdeeds;
			context.talents = talents;
			context.spells = spells;
			context.inventory = inventory;
		} else if (this.actor.type = 'monster') {
			const deeds=[];
			let items = Object.values(Object.values(this.actor.items)[4]);
			items.forEach((item, i) => {
				if(item.type == 'feature') {
					features.push(item);
				}
				else if (item.type == 'deed') {
					deeds['light'].push(item);
				}
			});
			context.deeds = deeds;
		}
		context.features = features;


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

		html.on('click', '.deed-roll', this._createdeedRoll.bind(this));
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

	async _createdeedRoll(event) {
		const li = $(event.currentTarget).parents('.deed');
		const deed = this.actor.items.get(li.data('itemId'));
		const ability_bonus = this.actor.system.ability_mods[deed.system.skill];
		console.log(deed.system.currentEffortCost);

		//This is where we can increase the roll information too.
		//this is just disgusting, ew
		if(deed.system.tier != 'basic') {
			const increase = deed.system.tier === 'special' ? 1 : 2;
			if(deed.currentEffortCost == 0) {
				deed.update({"system.currentEffortCost": increase});
				increase += increase;
			}
			if((this.actor.system.effort - deed.system.currentEffortCost) >= 0) {
				this.actor.update({"system.effort": this.actor.system.effort - deed.system.currentEffortCost});
				if(deed.system.increaseCount != 3) {
					deed.update({"system.currentEffortCost": deed.system.currentEffortCost + increase});
					deed.update({"system.increaseCount": deed.system.increaseCount + 1});
				}
			} else {
				return ui.notifications.warn("You do not have enough effort.");
			}
		}


		let sFlavor = deed.name;
		const roll = new Roll(
			"d20 + @abilityBonus + @skilledBonus",
			{
				abilityBonus: ability_bonus,
				skilledBonus: this.actor.system.skill_bonus
			});
		//If we are going with support. We just have DC 10.

		let hasDC = false;
		let succeedDC = false;
		// if(deed.system.isattack) {
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

//end
}
