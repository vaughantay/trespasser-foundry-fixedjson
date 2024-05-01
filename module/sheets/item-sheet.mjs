import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';


export class TrespasserItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['trespasser', 'sheet', 'item'],
      width: 520,
      height: 480,
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

		console.log(context)
			
		//If details isnt null, we need to enrich them.
		if(this.item.system.details !== null) {
			context.enrichedDetails = await TextEditor.enrichHTML(this.item.system.details, {async: true});
		}

		if(this.item.type == 'simple_item') {
			context.ItemTypes = CONFIG.TRESPASSER.SimpleItemTypes;
		}

		if(this.item.type == 'action') {
			context.ActionTypes = CONFIG.TRESPASSER.ActionTypes;
			context.Skills = CONFIG.TRESPASSER.Skills;
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
