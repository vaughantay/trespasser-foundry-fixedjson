import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';


export class TrespasserItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['trespasser', 'sheet', 'item'],
      width: 520,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'description',
        },
      ],
    });
  }

  get template() {
    const path = 'systems/trespasser/templates/item';

    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  async getData() {

		const context = super.getData();


		//If details isnt null, we need to enrich them.
		if(this.item.system.details !== null) {
			context.enrichedDetails = await TextEditor.enrichHTML(this.item.system.details, {async: true});
		}

		if(this.item.type == 'armor') {
			context.ArmorSlots = CONFIG.TRESPASSER.ArmorSlots;
			context.Weight = CONFIG.TRESPASSER.Weights;
			context.ArmorDiceSelections = CONFIG.TRESPASSER.ArmorDiceSelections;
		}

		if(this.item.type == 'weapon') {
			context.Weight = CONFIG.TRESPASSER.Weights;
			context.Damage = CONFIG.TRESPASSER.DamageDiceSelections;
      context.Type = CONFIG.TRESPASSER.WeaponTypes;
		}

		if(this.item.type == 'deed') {
			context.DeedTiers = CONFIG.TRESPASSER.DeedTiers;
			context.TargetTypes = CONFIG.TRESPASSER.TargetTypes;
      context.TargetSpecs = CONFIG.TRESPASSER.TargetSpecs;
			context.DeedCost = this.item.system.base_cost + this.item.system.increaseCount;
			context.DeedTypes = CONFIG.TRESPASSER.DeedTypes;
		}

		return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    if (!this.isEditable) return;

    html.on('click', '.effect-control', (ev) =>
      onManageActiveEffect(ev, this.item)
    );
  }
}
