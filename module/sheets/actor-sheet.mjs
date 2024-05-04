import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from '../helpers/effects.mjs'

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
		const features = [];
		const otherAbilities = [];
		const talents = [];
		const actions = [];
		const spells = [];

		for (const item in this.actor.items) {
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
			}
			
			//Return the weapons in either hand.
			if (item.type == 'weapon') {
				const weapon = item.system;
				if (weapon.equipped_left) {
					//This will look like right: {itemdetails}, left: {itemdetails}. Very cool
					equippedWeapons.left = item;
				} else if (weapon.equipped_right) {
					equippedWeapons.right = item;
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
			}

			if (item.type == 'action') {
				actions.push(item);
			}

			if(item.type == 'spell') {
				spells.push(item);
			}
		}

		context.AC = calculatedAC;
		context.equippedArmor = equippedArmor;
		context.features = features;
		context.otherAbilities = otherAbilities;
		context.talents = talents;
		context.actions = actions;
		context.spells = spells;

		//Need to add logic to pass weapons into the inventory, and armor.

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

    html.on('click', '.item-create', this._onItemCreate.bind(this));

    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

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
}
