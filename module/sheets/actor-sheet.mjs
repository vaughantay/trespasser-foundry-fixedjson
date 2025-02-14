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
			let items = this.actor.items;
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

					if (this.actor.system.weapons.weaponR == item._id) {
						equippedWeapons.right = item;
					} else if (this.actor.system.weapons.weaponL == item._id) {
						equippedWeapons.left = item;
					} else {
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


			//range calculation and two handed handling
			let mel = 1;
			let mis = 0;
			let spe = this.actor.system.attributes.intellect +1;
			if (equippedWeapons.left && equippedWeapons.right) {
				if (equippedWeapons.left.system.twohanded) {
					equippedWeapons.right = null;
				} else if (equippedWeapons.right.system.twohanded) {
					equippedWeapons.left = null;
				}
				spe = 0;
			} else {
				mel = 1;
			}
			if (equippedWeapons.left) {
				if (equippedWeapons.left.system.range.melee > mel) {
					mel = equippedWeapons.left.system.range.melee;
				}
				if (equippedWeapons.left.system.range.missile > mis) {
					mis = equippedWeapons.left.system.range.missile;
				}
				if (equippedWeapons.left.system.range.spell > spe) {
					spe = equippedWeapons.left.system.range.spell;
				}
			}
			if (equippedWeapons.right) {
				if (equippedWeapons.right.system.range.melee > mel) {
					mel = equippedWeapons.right.system.range.melee;
				}
				if (equippedWeapons.right.system.range.missile > mis) {
					mis = equippedWeapons.right.system.range.missile;
				}
				if (equippedWeapons.right.system.range.spell > spe) {
					spe = equippedWeapons.right.system.range.spell;
				}
			}


			context.melee = mel;
			context.missile = mis;
			context.spell=spe;
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

		} else if (this.actor.type == 'monster') {
			const deeds=[];
			let items = Object.values(Object.values(this.actor.items)[4]);
			items.forEach((item, i) => {
				if(item.type == 'feature') {
					features.push(item);
				}
				else if (item.type == 'deed') {
					deeds.push(item);
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
			const weapID = $(ev.currentTarget).parents('.item').data('itemId');
			this.actor.update({"system.weapons.weaponL": weapID});
    });
		html.on('click', '.weapon-equip-R', (ev) => {
			const weapID = $(ev.currentTarget).parents('.item').data('itemId');
			this.actor.update({"system.weapons.weaponR": weapID});
    });

		html.on('click', '.weapon-unequip', (ev) =>{
			const item = this.actor.items.get($(ev.currentTarget).data('itemId'));
			const isLeft = (item._id === this.actor.system.weapons.weaponL) ? true : false;
			if (isLeft) {
				this.actor.update({"system.weapons.weaponL": ''});
			} else {
				this.actor.update({"system.weapons.weaponR": ''});
			}
		});

		html.on('click', '.armor-equip', (ev) =>{
			const item = this.actor.items.get($(ev.currentTarget).parents('.item').data('itemId'));
			if (item) {
				item.update({ 'system.equipped' :  true });
			}
		});

		html.on('click', '.armor-unequip', (ev) =>{
			const li = $(ev.currentTarget).parents('.armorslot');
			const item = this.actor.items.get(li.data('itemId'));
			if (item) {
				item.update({ 'system.equipped' :  false });
			}
		});

    html.on('click', '.item-create', this._onItemCreate.bind(this));

    html.on('click', '.item-delete', this._onItemDelete.bind(this));


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

		html.on('click', '.deed-start', this._deedStart.bind(this));
		html.on('click', '.deed-base', this._deedBase.bind(this));
		html.on('click', '.deed-hit', this._deedHit.bind(this));
		html.on('click', '.deed-spark', this._deedSpark.bind(this));
		html.on('click', '.deed-after', this._deedAfter.bind(this));


		html.on('click', '.expand-header', (ev) => {
			let li = $(ev.currentTarget.parentNode).find('.expand');
			if (li.is(':hidden')) {
				li.slideDown();
			} else {
				li.slideUp();
			}
		});

		html.on('click', '.armordie', this._spendArmorDie.bind(this));


		html.on('click', '.keyattribute', (ev) => {

		});

		html.on('click', '.recollect', (ev) => {
			let d = new Dialog({
 				title: "Moment's Rest",
 				content: "<p>Spend a moment(±10 minutes) resting?</p>",
 				buttons: {
  			one: {
   			icon: '<i class="fas fa-check"></i>',
   			label: "Rest",
			  callback: () =>
				{
					this.actor.update({"system.effort": this.actor.system.attributes.intellect})
					let items = this.actor.items;
					items.forEach((item, i) => {
						if (item.type == 'armor') {
							if (item.system.equipped) {
								item.update({'system.die_used' : false})
							}
						}
					});
					const message = {header:'',text:''}
					message.header = this.actor.name + " takes a moment's rest."
					message.text = "- Spend any number of your available recovery dice, regaining hit points equal to the maximum value for each die. <br>"
					+ "- You may erase two checkmarks from their focus costs. <br>"
					+ "- Your armor dice have been repaired."
					const message_details = `<div class='message-text flexcol'>
					<br>
					<h5>${message.header}</h5>
						<div class='box'>
							<hr>
						<p class='small'>
						${message.text}
						</p>
						</div>
					</div>`
					ChatMessage.create({user: game.user._id, content: message_details});
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

		html.on('click', '.longrest', (ev) => {
			let d = new Dialog({
 			title: "Night's Rest",
 			content: "<p>Spend a night resting?</p>",
 			buttons: {
  		one: {
   		icon: '<i class="fas fa-check"></i>',
   		label: "Rest",
			   callback: () =>
				 {
					 this.actor.update({"system.effort": this.actor.system.attributes.intellect, "system.combat.hit_points.value": this.actor.system.combat.hit_points.max, "system.recovery.current": this.actor.system.endurance.current})
					 let items = this.actor.items;
					 items.forEach((item, i) => {
						 if (item.type == 'armor') {
							 if (item.system.equipped) {
								 item.update({'system.die_used' : false})
							 }
						 } else if (item.type == 'deed') {
							 item.update({'system.increaseCount':0});
						 }
					 });
					 const message = {header:'',text:''}
					 message.header = this.actor.name + " takes a night's rest."
					 message.text = "- Recovery Dice Reset <br>"
					 + "- Hit Points Regained <br>"
					 + "- Focus Costs Reset <br>"
					 + "- Armor Dice Repaired";
					 const message_details = `<div class='message-text flexcol'>
					 <br>
					 <h5>${message.header}</h5>
						 <div class='box'>
							 <hr>
						 <p class='small'>
						 ${message.text}
						 </p>
						 </div>
					 </div>`
					 ChatMessage.create({user: game.user._id, content: message_details});
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

		html.on('click', '.weekrest', (ev) => {
			let d = new Dialog({
 			title: "Week's Rest",
 			content: "<p>Spend a week resting?</p>",
 			buttons: {
  		one: {
   		icon: '<i class="fas fa-check"></i>',
   		label: "Rest",
			   callback: () =>
				{
					this.actor.update({"system.endurance.current":this.actor.system.max_endurance})
					this.actor.update({"system.effort": this.actor.system.attributes.intellect, "system.combat.hit_points.value": this.actor.system.combat.hit_points.max, "system.recovery.current": this.actor.system.endurance.current})
					let items = this.actor.items;
					items.forEach((item, i) => {
						if (item.type == 'armor') {
							if (item.system.equipped) {
								item.update({'system.die_used' : false})
							}
						} else if (item.type == 'deed') {
							item.update({'system.increaseCount':0});
						}
					});
					const message = {header:'',text:''}
					message.header = this.actor.name + " takes a week's rest."
					message.text = "- Advance one injury clock by 1<br>"
					+ "- Endurance Reset  <br>"
					+ "- Focus Costs Reset <br>"
					+ "- Armor Dice Repaired";
					const message_details = `<div class='message-text flexcol'>
					<br>
					<h5>${message.header}</h5>
						<div class='box'>
							<hr>
						<p class='small'>
						${message.text}
						</p>
						</div>
					</div>`
					ChatMessage.create({user: game.user._id, content: message_details});
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
			}
		});
		html.on('click', '.increase-checks', (ev) => {
			const li = $(ev.currentTarget).parents('.deed');
			const item = this.actor.items.get($(li).data('itemId'));
			item.update({"system.increaseCount": item.system.increaseCount + 1});
		});
		html.on('contextmenu', '.increase-checks', (ev) => {
			const li = $(ev.currentTarget).parents('.deed');
			const item = this.actor.items.get($(li).data('itemId'));
			item.update({"system.increaseCount": item.system.increaseCount - 1});
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

	async _onItemDelete(event){
		const li = $(event.currentTarget).parents('.item');
		const item = this.actor.items.get(li.data('itemId'));
		console.log(li);
		item.delete();
		li.slideUp(200, () => this.render(false));
	}

	async _createRoll(event) {

		const data = await renderDialog(
			game.i18n.localize('TRESPASSER.Dialogs.roll'),
			this._processRollDialog,
			{
				abilities: {...CONFIG.TRESPASSER.AbilitiesLong},
				skills: {...CONFIG.TRESPASSER.PlayerSkills},
				selectedAbility: "Agility",
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
	async _spendArmorDie(event) {
		let diceCount = 1;
		const li = $(event.currentTarget).parents('.armorslot');
		const item = this.actor.items.get(li.data('itemId'));
		if (item) {
			let name = item.name;
			let d = new Dialog({
				title: "Armour Die",
				content: `<p>Spend your ${name}'s armour die'?</p>`,
				buttons: {
				one: {
				icon: '<i class="fas fa-check"></i>',
				label: "Yes",
				callback: () =>
				{
					let diceType = item.system.armor_die;
					item.update({ 'system.die_used' :  true });
					const rollFormula = `${diceCount}d${diceType}`;
					const roll = new TrespasserRoll(rollFormula);
					let sFlavor = item.name ;

					roll.toMessage({
						flavor:sFlavor,
						speaker: ChatMessage.getSpeaker({ actor: this.actor }),
						rollMode: game.settings.get('core', 'rollMode'),
					}
					);
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
		}
	}
	async _createdeedRoll(event) {
		console.log(event.currentTarget);
		const li = $(event.currentTarget).parents('.deed');
		const deed = this.actor.items.get(li.data('itemId'));

		//base cost is calculated by the tier.
		//Increase Count is added when used, unless it is a light deed.
		const focusCost = deed.system.current_cost;

		if (this.actor.system.effort < focusCost) {
			return ui.notifications.warn("You do not have enough focus.");
		}
		if (deed.system.type == "missile") {
			if (this.actor.system.range.missile == 0) {
				return ui.notifications.warn("This is a missile deed. You have no missile weapons equipped.");
			}
		}

		let DC = 0;

		if (deed.system.isattack) {
			if (Array.from(game.user.targets).length > 0) {
				const target = Array.from(game.user.targets)[0].actor.system;
				//If we target guard, set dc to guard, otherwise use resist.
				DC = deed.system.targetguard ? target.guard : target.resist
			} else {
				//if nothing is targeted, use DC -1
				DC = -1;
			}
		} else {
			//Support deeds have dc of 10
			DC = 10;
		}

		const roll = new TrespasserRoll(
			"d20 + @accuracy",
			DC,
			{
				accuracy: this.actor.system.accuracy
			},
		);

		let sFlavor = deed.name;

		const evaluationData = await roll.evaluate();

		roll.deedMessage({
			flavor:sFlavor,
			speaker: ChatMessage.getSpeaker({ actor: this.actor }),
			rollMode: game.settings.get('core', 'rollMode'),
		});

		//Light deeds will not change in cost. but they increase focus by skill
		if (deed.system.tier != 'light') {
			this.actor.update({"system.effort": this.actor.system.effort - focusCost});
			deed.update({"system.increaseCount": deed.system.increaseCount + 1});
		}
		else {
			this.actor.update({"system.effort": this.actor.system.effort + this.actor.system.skill_bonus});
		}
	}

	async postMessage(message){
		console.log('daoin');

	}

	async _deedStart(event){
		const li = $(event.currentTarget).parents('.deed');
		const deed = this.actor.items.get(li.data('itemId'));
		await this._rollDeedDamage(deed,'start');
	}
	async _deedBase(event){
		const li = $(event.currentTarget).parents('.deed');
		const deed = this.actor.items.get(li.data('itemId'));
		await this._rollDeedDamage(deed,'base');
	}
	async _deedHit(event){
		const li = $(event.currentTarget).parents('.deed');
		const deed = this.actor.items.get(li.data('itemId'));
		await this._rollDeedDamage(deed,'hit');
	}
	async _deedSpark(event){
		const li = $(event.currentTarget).parents('.deed');
		const deed = this.actor.items.get(li.data('itemId'));
		await this._rollDeedDamage(deed,'spark');
	}
	async _deedAfter(event){
		const li = $(event.currentTarget).parents('.deed');
		const deed = this.actor.items.get(li.data('itemId'));
		await this._rollDeedDamage(deed,'after');
	}
	async _rollDeedDamage(deed, type){
		const messageDeedAdditions = {message:'',name:'',type:'',roll:true};
		messageDeedAdditions.roll = true;
		messageDeedAdditions.name = deed.name;
		messageDeedAdditions.type = type.toUpperCase();
		let diceCount = 0;
		let message = '';
		switch (type) {
			case 'start':
				messageDeedAdditions.message = deed.system.start;
				break;
			case 'base':
				messageDeedAdditions.message = deed.system.base.text;
				diceCount = deed.system.base.damage;
				break;
			case 'hit':
				messageDeedAdditions.message = deed.system.hit.text;
				diceCount = deed.system.hit.damage;
				break;
			case 'spark':
				messageDeedAdditions.message = deed.system.spark.text;
				diceCount = deed.system.spark.damage;
				break;
			case 'after':
				messageDeedAdditions.message = deed.system.after;
				break;
		}


		//potency dice by default, if its weapon damage, we do logic to overwrite it.
		let diceType = this.actor.system.potency_dice;

		//if its weapon, we have to check which weapons use the right range and shit dawg
		//// ['innate', 'spell', 'missile', 'item', 'melee', 'unarmed', 'versatile'],
		if (deed.system.damagetype) {
			if (deed.system.type == "missile") {
				if (this.actor.system.range.missile == 0) {
					return ui.notifications.warn("This is a missile deed. You have no missile weapons equipped.");
				}
			}
			//If its weapon damage, this will be true, and we need to choose the highest damage weapon
			const weaponRDamage = parseInt(this.actor.items.get(this.actor.system.weapons.weaponR)?.system.damage);
			const weaponLDamage = parseInt(this.actor.items.get(this.actor.system.weapons.weaponL)?.system.damage);
			const weaponRDam_NaN = isNaN(weaponRDamage) ? 0 : weaponRDamage;
			const weaponLDam_NaN = isNaN(weaponLDamage) ? 0 : weaponLDamage;
			//if they both return nothing, WE USE UNARMED DAMAGE IF ITS MELEE
			if (isNaN(weaponRDamage) && isNaN(weaponLDamage)) {
				diceType = 4;
			} else diceType = (weaponRDam_NaN > weaponLDam_NaN) ? weaponRDam_NaN : weaponLDam_NaN;

		}

		//Basically if we have 0 dice, we dont want to post 0d10 or something, so we just ignore making the roll, and post
		//A chat message with the relevant details.
		if(diceCount == 0) {
			messageDeedAdditions.roll = false;
			const message_details = await renderTemplate('systems/trespasser/templates/chat/deed-result.hbs', messageDeedAdditions)
			console.log(message_details);
			ChatMessage.create({user: game.user._id, content: message_details});
		} else {

			const rollFormula = `${diceCount}d${diceType}`;

			const roll = new TrespasserRoll(rollFormula);

			let sFlavor = deed.name + ' | ' + type.toUpperCase();

			roll.toMessage({
				flavor:sFlavor,
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				rollMode: game.settings.get('core', 'rollMode'),
			},
			{},
			await renderTemplate('systems/trespasser/templates/chat/deed-result.hbs', messageDeedAdditions)
			);
		}
	}
}
