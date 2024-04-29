import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';


export class TrespasserItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['boilerplate', 'sheet', 'item'],
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

  getData() {
		return {
			item: this.item,
			system: this.item.system,
			flags: this.item.flags,
			effects: prepareActiveEffectCategories(this.item.effects)
		};
  }

  activateListeners(html) {
    super.activateListeners(html);

    if (!this.isEditable) return;

    html.on('click', '.effect-control', (ev) =>
      onManageActiveEffect(ev, this.item)
    );
  }
}
